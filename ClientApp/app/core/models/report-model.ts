import { HomeReportsItems } from "@app/home/home-reports/home-reports-items/home-reports-items";

export interface ReportModel {
    reportDetail: ReportDetailModel;
    similarReports: HomeReportsItems[];
    recommendedReports: HomeReportsItems[];
    totalCompanyReport: number;
}

export interface ReportDetailModel {
    id: number;
    title: string;
    languageCode: string;
    companyCode: string;
    companyName: string;
    logoLocation: string;
    sectorID: number;
    industryID: number;
    thumbnailFileLocationFull: string;
    fileLocationFull: string;
    countryCode: string;
    companyTotal: number;
}