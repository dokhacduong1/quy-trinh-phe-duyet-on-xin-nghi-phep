package com.truetech.rest.api

import com.truetech.core.constants.ModuleCodeConst
import com.truetech.core.factory.ServiceFactory
import org.bonitasoft.web.extension.rest.RestAPIContext
import org.bonitasoft.web.extension.rest.RestApiController
import org.bonitasoft.web.extension.rest.RestApiResponse
import org.bonitasoft.web.extension.rest.RestApiResponseBuilder

import javax.servlet.http.HttpServletRequest

class Post_E_leaveV3_List implements RestApiController{
    @Override
    RestApiResponse doHandle(HttpServletRequest request, RestApiResponseBuilder responseBuilder, RestAPIContext context) {
        return ServiceFactory.createListService(
                context,
                'ELEAVE'
        ).getList(request, responseBuilder)
    }
}
