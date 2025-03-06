package com.truetech.rest.api

import com.truetech.core.factory.ServiceFactory
import org.bonitasoft.web.extension.rest.RestAPIContext
import org.bonitasoft.web.extension.rest.RestApiController
import org.bonitasoft.web.extension.rest.RestApiResponse
import org.bonitasoft.web.extension.rest.RestApiResponseBuilder

import javax.servlet.http.HttpServletRequest

class Post_E_leaveV3_PageData implements RestApiController{

    @Override
    RestApiResponse doHandle(HttpServletRequest request, RestApiResponseBuilder responseBuilder, RestAPIContext context) {
        return ServiceFactory
                .createPageDataService(request, context)
                .getPageData(responseBuilder)
    }
}
