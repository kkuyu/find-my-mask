// List
export type ListParams = {
  BSSH_NM: string;
  PRDLST_NM: string;
  pageNo: number;
  numOfRows: number;
  serviceKey?: string;
  type?: 'json' | 'xml';
};

export interface ListItem {
  [index: string]: any;
  BSSH_NM: string;
  CLSF_NO_NM: string;
  GRADE: string;
  PRDLST_NM: string;
  PRDLST_PRMSN_YMD: string;
  PRDLST_SN: string;
  PRMSN_KIND_CD_NM: string;
}

export interface ListResult {
  header: {
    resultCode: string;
    resultMsg: string;
  };
  body: {
    numOfRows: number;
    pageNo: number;
    totalCount: number;
    items: ListItem[];
  };
}

// Product
export type ProductParams = {
  item_name: string;
  numOfRows: number;
  serviceKey?: string;
  type?: 'json' | 'xml';
};

export interface ProductItem {
  [index: string]: any;
  CLASS_NO: string;
  CLASS_NO_NAME: string;
  ENTP_NAME: string;
  ENTP_NO: string;
  ENTP_SEQ: string;
  ITEM_NAME: string;
  ITEM_SEQ: string;
  EE_DOC_DATA: {}[] | {} | string;
  NB_DOC_DATA: {}[] | {} | string;
  UD_DOC_DATA: {}[] | {} | string;
}

export interface ProductResult {
  header: {
    resultCode: string;
    resultMsg: string;
  };
  body: {
    numOfRows: number;
    pageNo: number;
    totalCount: number;
    items: ProductItem[];
  };
}
