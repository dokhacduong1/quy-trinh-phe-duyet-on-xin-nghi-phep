package com.truetech.rest.api

import com.truetech.core.constants.ModuleCodeConst
import com.truetech.core.factory.ServiceFactory
import com.truetech.core.repository.DataSpyRepository
import org.bonitasoft.web.extension.rest.RestAPIContext
import org.bonitasoft.web.extension.rest.RestApiController
import org.bonitasoft.web.extension.rest.RestApiResponse
import org.bonitasoft.web.extension.rest.RestApiResponseBuilder

import javax.servlet.http.HttpServletRequest

class Post_E_leaveV3_Comment implements RestApiController{
    @Override
    RestApiResponse doHandle(HttpServletRequest request, RestApiResponseBuilder responseBuilder, RestAPIContext context) {
        return ServiceFactory.createCommentService(
                context,
                /*IDetailRepository*/new E_leaveRepository(context),
                'ELEAVE'
        ).routeAction(request, responseBuilder)
    }
}
