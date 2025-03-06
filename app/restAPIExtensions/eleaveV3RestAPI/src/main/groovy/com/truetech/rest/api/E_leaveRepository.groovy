package com.truetech.rest.api

import com.truetech.core.dto.request.DTLS_DOC_CMT_RequestFetchDto
import com.truetech.core.dto.request.DTLS_RequestSAVE_DELETE_Dto
import com.truetech.core.repository.IDetailRepository
import com.truetech.core.service.SqlSingleton
import groovy.sql.Sql
import org.bonitasoft.web.extension.rest.RestAPIContext

import java.sql.SQLException

class E_leaveRepository implements IDetailRepository {
    private Sql sql

    E_leaveRepository(RestAPIContext context) {
        this.sql = SqlSingleton.getInstance(context)
    }

    @Override
    Map getDetail(String id) {
        return this.sql.firstRow("""
            SELECT * 
            FROM Office.Eleave
            WHERE id = ?
		""", [id])
    }

    @Override
    Map getDefaultDetail() {
        return null
    }

    @Override
    Map updateDetail(DTLS_RequestSAVE_DELETE_Dto body) {
        return null
    }

    @Override
    Map createDetail(DTLS_RequestSAVE_DELETE_Dto body) throws SQLException {
        return null
    }

    @Override
    void deleteDetail(DTLS_DOC_CMT_RequestFetchDto body) {

    }
}
