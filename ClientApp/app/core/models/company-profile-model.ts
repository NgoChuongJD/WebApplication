import { HomeReportsItems } from "@app/home/home-reports/home-reports-items/home-reports-items";

export interface CompanyProfileModel {
    company: CompanyProfile;
    latestReport: HomeReportsItems;
    instruments: Instrument[];
}

export interface CompanyProfile {
    companyCode: string;
    totalReports: number;
    sectorID: number;
    companyName: string;
    companyNameEncoded: string;
    countryName: string;
    sectorName: string;
    industryName: string;
    logoLocation: string;
    bannerLocation: string;
}

export interface Instrument {
    symbol: string;
    marketName: string;
    currencyCode: string;
    lastPrice: number;
    change52W: number;
    percentChange52W: number;
    segmentName: string;
    selected: boolean;
}