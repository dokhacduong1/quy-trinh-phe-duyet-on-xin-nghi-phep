function WidgetlivingApplicationMenuController($scope, $http, $window, $location, $timeout, modalService) {
    var ctrl = this;
    /** PhanHa Active Menu  **/
    
    $scope.activeIndex = null;
    $scope.activeSubIndex = null;
    $scope.activeLastIndex = null;
    $scope.isHighlightedMenu = false;
    ctrl.removeClassMenu = function () {
        $scope.isHighlightedMenu = true;
    };
    
    ctrl.addClassMenu = function () {
        $scope.isHighlightedMenu  = false;
    };

    ctrl.activateItem = function(value) {
        if(value == "Tasks"){
            $scope.activeIndex = null;
            $scope.activeSubIndex = null; // Reset subitem activation
            $scope.activeLastIndex = null;
            $scope.activeIndex = parentIndex;
            $scope.activeSubIndex = childIndex;
        }
    };

    ctrl.activateSubItem = function(parentIndex, subIndex) {
        $scope.activeIndex = parentIndex;
        $scope.activeSubIndex = subIndex;
        $scope.activeLastIndex = null;
    };
    
    ctrl.activateSubItemLast = function(parentIndex, subIndex,lastIndex) {
        $scope.activeIndex = parentIndex;
        $scope.activeLastIndex = lastIndex;
        $scope.activeSubIndex = null;
    };
    
    /** End Active Menu  **/
    
    const getCookieValue = (name) => (
        document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
    )

    let menuForBPM = ['admin-process-list', 'admin-case-list', 'admin-task-list']

    /**
     * Filter the application menu list to only show the children of the given parent
     * @param parentId
     * @returns {T[]}
     */
    ctrl.filterChildren = function (parentId) {
        let filtered = (ctrl.applicationMenuList || []).filter(function (menu) {
            return menu.parentMenuId === '' + parentId && !menuForBPM.includes(menu.applicationPageId.token);
        });
        console.log("filterChildren",filtered);
        return filtered;
    };

    /**
     * Filter the application menu list to only show the children of BPM
     * @returns {T[]}
     */
    ctrl.filterChildrenForBPM = function () {
        let filtered = (ctrl.applicationMenuList || []).filter(function (menu) {
            return menuForBPM.includes(menu.applicationPageId.token);
        });
        return filtered;
    }

    /**
     * Check if the application menu list contains the item of BPM
     * @returns {boolean}
     */
    ctrl.isHasBPM = function (menuDisplayName) {
        let filtered = (ctrl.applicationMenuList || []).filter(function (menu) {
            return menuForBPM.includes(menu.applicationPageId.token);
        });
        return filtered.length > 0 && menuDisplayName === 'Management';
    }

    ctrl.isParentMenu = function (menu) {
        return menu.parentMenuId == -1 && menu.applicationPageId == -1;
    };


    ctrl.displayPage = function (token) {
        $scope.activeIndex = null;
        var previousToken = ctrl.pageToken;
        var previousPath = window.location.pathname;

        ctrl.pageToken = token;
        var urlPath = previousPath.substring(0, previousPath.length - previousToken.length - 1) + token + '/' + $window.location.search;

        var stateObject = { title: "" + token + "", url: "" + urlPath + "" };
        if (typeof ($window.history.pushState) != "undefined") {
            $window.history.pushState(stateObject, stateObject.title, stateObject.url);
        } else {
            alert("Browser does not support HTML5.");
        }
        // if the super admin is logged in there is no userId
        if (!$scope.properties.userId) {
            refreshPage();
            return false;
        }
        // make sure the user is still logged in before refreshing the iframe
        $scope.isHighlightedMenu = true;
        verifySession().then(setTargetedUrl, refreshPage);

        return false;
    };

    ctrl.openCurrentSessionModal = function () {
        modalService.open($scope.properties.currentSessionModalId);
    };

    ctrl.openAppSelectionModal = function () {
        modalService.open($scope.properties.appSelectionModalId);
    };

    //handle the browser back button
    $window.addEventListener('popstate', function (e) {
        parseCurrentURL();
        //make sure the user is still logged in before refreshing the iframe
        setTargetedUrl();
        refreshPage();
    });

    function parseCurrentURL() {
        var pathArray = $window.location.pathname.split('/');
        ctrl.applicationToken = pathArray[pathArray.length - 3];
        ctrl.pageToken = pathArray[pathArray.length - 2];
    }

    function setApplicationMenuList(application) {
        return $http.get('../API/living/application-menu/?c=100&f=applicationId%3D' + application.id + '&d=applicationPageId&o=menuIndex+ASC')
            .success(function (data) {
                //   const encodedData = encodeURIComponent(JSON.stringify(data))
                // console.log("menus JSON.stringify(data) " + JSON.stringify(data))

                // -----------

                var myHeaders = new Headers();
                myHeaders.append("X-Bonita-API-Token", getCookieValue('X-Bonita-API-Token'));
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Cookie", "JSESSIONID=" + getCookieValue('JSESSIONID'));

                var req = {
                    method: 'PUT',
                    url: $scope.properties.urlExtensionAPI,
                    headers: myHeaders,
                    data: JSON.stringify(data)
                }

                $http(req).then(function (response) {
                    console.log("-----------response.data------------ " + JSON.stringify(response.data))
                    if (response && response.data && response.data.length > 0) {
                        ctrl.applicationMenuList = response.data
                        console.log("-----------ctrl.applicationMenuList------------ " + JSON.stringify(ctrl.applicationMenuList))
                    } else {
                        ctrl.applicationMenuList = data
                    }
                }, function (error) { console.log("-----------error------------ " + JSON.stringify(error)) });

                var data3 = [
                    {
                        "applicationPageId": {
                            "id": "8461",
                            "pageId": "32",
                            "applicationId": "3829",
                            "token": "task-list"
                        },
                        "parentMenuId": "-1",
                        "menuIndex": "14",
                        "displayName": "Tasks",
                        "id": "9672",
                        "applicationId": "3829"
                    }
                ]
                // ctrl.applicationMenuList = data3;

            });
    }

    function searchSeparator() {
        return $window.location.search ? "&" : "?";
    }

    function setTargetedUrl() {
        // angular hack to force the variable bound to refresh
        // so we change it's value to undefined and then delay to the correct value
        $scope.properties.targetUrl = undefined;
        $timeout(function () {
            $scope.properties.targetUrl = "../../../portal/resource/app/" + ctrl.applicationToken + "/" + ctrl.pageToken + "/content/" + $window.location.search + searchSeparator() + "app=" + ctrl.applicationToken;
        }, 0);
    }

    function refreshPage() {
        $window.location.reload();
    }

    function verifySession() {
        var userIdentity = '../API/identity/user/' + $scope.properties.userId;
        return $http.get(userIdentity);
    }

    function setApplication() {
        var application = $scope.properties.application;
        ctrl.applicationToken = application.token;
        ctrl.pageToken = $scope.properties.pageToken;
        ctrl.applicationName = $scope.properties.application.displayName;
        setApplicationMenuList(application);
        setTargetedUrl();
    }

    setApplication();

}