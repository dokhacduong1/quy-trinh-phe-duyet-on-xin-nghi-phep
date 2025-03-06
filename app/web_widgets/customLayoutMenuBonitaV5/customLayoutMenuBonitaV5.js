(function () {
  try {
    return angular.module('bonitasoft.ui.widgets');
  } catch(e) {
    return angular.module('bonitasoft.ui.widgets', []);
  }
})().directive('customLayoutMenuBonitaV5', function() {
    return {
      controllerAs: 'ctrl',
      controller: function WidgetlivingApplicationMenuController($scope, $http, $window, $location, $timeout, modalService) {
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

},
      template: '<div class="navbar navbar-inverse navbar-inverse-menu main-navbar-menu" role="navigation">\n    <div class="container-fluid">\n\n        <!--Start Menu mobile-->\n        <div class="nav nav-menu-mobile">\n            <nav>\n                <a href="javascript:void(0);" class="mobile-menu-trigger" ng-click="ctrl.addClassMenu()">\n                    <button type="button" class="navbar-toggle">\n                        <span class="icon-bar"></span>\n                        <span class="icon-bar"></span>\n                        <span class="icon-bar"></span>\n                    </button>\n                </a>\n                <ul class="menu menu-bar" ng-class="{ \'remove-active-menu\': isHighlightedMenu}">\n                    <button type="button" ng-click="ctrl.removeClassMenu()" class="icon-close-menu">\n                        <span><i class="fa fa-times" aria-hidden="true"></i></span>\n                    </button>\n                    <li ng-repeat="menu in ctrl.filterChildren(-1)" ng-click="ctrl.activateItem(menu.displayName)">\n                        <a ng-if="!ctrl.isParentMenu(menu)" ng-click="ctrl.displayPage(menu.applicationPageId.token)"\n                            href="../{{menu.applicationPageId.token}}/" class="menu-link menu-bar-link menu-nav-link"><i\n                                class="fa fa-tag fa-6" aria-hidden="true"></i>\n                            {{menu.displayName | uiTranslate}}</a>\n                        <a href="javascript:void(0);" ng-if="ctrl.isParentMenu(menu)" class="menu-link menu-bar-link"\n                            aria-haspopup="true"><i class="fa fa-file-text-o" aria-hidden="true"></i>\n                            {{menu.displayName | uiTranslate}} <span class="icon-right">❯</span></a>\n                        <ul class="mega-menu mega-menu--flat" ng-if="ctrl.isParentMenu(menu)">\n                            <li ng-repeat="childMenu in ctrl.filterChildren(menu.id)">\n                                <a ng-click="ctrl.displayPage(childMenu.applicationPageId.token)"\n                                    class="menu-link mega-menu-link mega-menu-header menu-nav-link"\n                                    href="../{{childMenu.applicationPageId.token}}/"><i class="fa fa-tag fa-6"\n                                        aria-hidden="true"></i> {{childMenu.displayName |\n                                    uiTranslate}}</a>\n                            </li>\n                            <li ng-if="ctrl.isHasBPM(menu.displayName)">\n                                <a href="javascript:void(0);" class="menu-link mega-menu-link mega-menu-header"><i\n                                        class="fa fa-file-text-o" aria-hidden="true"></i> BPM</a>\n                                <ul class="menu menu-list">\n                                    <li ng-repeat="childMenu in ctrl.filterChildrenForBPM()" class="last-child-menu">\n                                        <a href="../{{childMenu.applicationPageId.token}}/"\n                                            ng-click="ctrl.displayPage(childMenu.applicationPageId.token)"\n                                            class="menu-link menu-list-link menu-last menu-nav-link">\n                                            <i class="fa fa-tag fa-6" aria-hidden="true"></i> {{childMenu.displayName |\n                                            uiTranslate}}\n                                        </a>\n                                    </li>\n                                </ul>\n                            </li>\n                            <li class="mobile-menu-back-item">\n                                <a href="javascript:void(0);" class="menu-link mobile-menu-back-link"><span\n                                        class="icon-left">❮</span>Back</a>\n                            </li>\n                            <button type="button" ng-click="ctrl.removeClassMenu()"\n                                class="icon-close-menu-v2 icon-close-menu">\n                                <i class="fa fa-times" aria-hidden="true"></i>\n                            </button>\n                        </ul>\n                         <li>\n                            <a ng-href="https://password.truetech.com.vn/authorization.do" target="_self" class="menu-link menu-bar-link menu-nav-link link-change-pass"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Change my password</a>\n                        </li>\n                         <li>\n                            <a ng-href="{{properties.logoutURL}}" target="_self" class="menu-link menu-bar-link menu-nav-link link-sign-out"><i class="fa fa-sign-out" aria-hidden="true"></i> Sign out</a>\n                        </li>\n                    </li>\n\n                    <li class="mobile-menu-header">\n                        <a class="navbar-brand link-logo visible-xs" href="javascript:void(0);">\n                            <!--{{ctrl.applicationName}}-->\n                            <!--<img src = "./widgets/customLayoutMenuBonitaV5/assets/img/logo.png?format=text" alt = "logo-truebpm" height = "38.5px" />-->\n                            <i title="{properties.userName}" class="fa fa-user-circle-o" aria-hidden="true"></i>\n                            <p>{{properties.userName}}</p>\n                        </a>\n                    </li>\n                </ul>\n            </nav>\n        </div>\n        <!--End Menu mobile-->\n\n        <div class="navbar-header hide-mobile">\n            <a class="navbar-brand link-logo visible-xs" ng-click="ctrl.displayPage(properties.homePageToken)"\n                href="../{{properties.homePageToken}}/">\n                <!--{{ctrl.applicationName}}-->\n            </a>\n            <button type="button" ng-init="navCollapsed = true" ng-click="navCollapsed = !navCollapsed"\n                class="navbar-toggle">\n                <span class="icon-bar"></span>\n                <span class="icon-bar"></span>\n                <span class="icon-bar"></span>\n            </button>\n        </div>\n        <div collapse="navCollapsed" class="collapse navbar-responsive-collapse navbar-collapse">\n            <ul class="nav navbar-nav" id="myDiv">\n                <li class="menu-level-0" ng-class="{ \'active\': ctrl.pageToken=== menu.applicationPageId.token }"\n                    ng-repeat="menu in ctrl.filterChildren(-1)" ng-click="ctrl.activateItem(menu.displayName)">\n                    <a ng-if="!ctrl.isParentMenu(menu)" ng-click="ctrl.displayPage(menu.applicationPageId.token)"\n                        href="../{{menu.applicationPageId.token}}/"><span class="maxTitleWidth">{{menu.displayName |\n                            uiTranslate}}</span></a>\n                    <a ng-if="ctrl.isParentMenu(menu)" ng-class="{ \'active-parent\': activeIndex === $index }"\n                        href="javascript:void(0);" dropdown-toggle>{{menu.displayName |\n                        uiTranslate}}<i class="fa fa-angle-down" aria-hidden="true"></i></a>\n                    <ul ng-if="ctrl.isParentMenu(menu)" class="dropdown-menu menu-level-ul-1">\n                        <li ng-repeat="childMenu in ctrl.filterChildren(menu.id)"\n                            ng-click="ctrl.activateSubItem($parent.$index, $index)">\n                            <a ng-click="ctrl.displayPage(childMenu.applicationPageId.token)"\n                                ng-class="{ \'active-child\': activeIndex === $parent.$index && activeSubIndex === $index }"\n                                href="../{{childMenu.applicationPageId.token}}/">\n                                {{childMenu.displayName | uiTranslate}}\n                            </a>\n                        </li>\n\n                        <!-- BPM -->\n                        <li class="bpm-menu" ng-if="ctrl.isHasBPM(menu.displayName)">\n                            <span class="submenu-text">\n                                <div class="bpm-menu-content">\n                                    <div>BPM</div>\n                                    ❯\n                                </div>\n                            </span>\n                            <ul class="dropdown-menu bpm-submenu">\n                                <li ng-repeat="childMenu in ctrl.filterChildrenForBPM()"\n                                    ng-click="ctrl.activateSubItemLast($parent.$index,null, $index)">\n                                    <a ng-click="ctrl.displayPage(childMenu.applicationPageId.token)"\n                                        ng-class="{ \'active-child-lv3\': activeIndex === $parent.$index && activeLastIndex === $index }"\n                                        href="../{{childMenu.applicationPageId.token}}/">\n                                        {{childMenu.displayName | uiTranslate}}\n                                    </a>\n                                </li>\n                            </ul>\n                        </li>\n                    </ul>\n                </li>\n            </ul>\n        </div>\n    </div>\n</div>'
    };
  });
