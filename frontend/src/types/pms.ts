/**
 * PMS (Product Management System) Type Definitions
 * Migrated from Vue mall-admin-web project
 */

// ============ Brand Types ============
export interface Brand {
    id?: number
    name: string
    firstLetter: string
    sort: number
    factoryStatus: 0 | 1
    showStatus: 0 | 1
    productCount?: number
    productCommentCount?: number
    logo: string
    bigPic: string
    brandStory: string
}

// ============ Product Category Types ============
export interface ProductCategory {
    id?: number
    parentId: number
    name: string
    level: number
    productCount?: number
    productUnit: string
    navStatus: 0 | 1
    showStatus: 0 | 1
    sort: number
    icon: string
    keywords: string
    description: string
    children?: ProductCategory[]
}

// ============ Product Attribute Category Types ============
export interface ProductAttrCategory {
    id?: number
    name: string
    attributeCount?: number
    paramCount?: number
    productAttributeList?: ProductAttribute[]
}

// ============ Product Attribute Types ============
export interface ProductAttribute {
    id?: number
    productAttributeCategoryId: number
    name: string
    selectType: 0 | 1 | 2 // 0=手动输入 1=从列表选择 2=单选
    inputType: 0 | 1 // 0=手动输入 1=从选项列表选择
    inputList: string // 输入选项，逗号分隔
    sort: number
    filterType: 0 | 1 // 0=普通 1=颜色
    searchType: 0 | 1 | 2 // 0=不可检索 1=关键字检索 2=范围检索
    relatedStatus: 0 | 1 // 相同属性产品是否关联
    handAddStatus: 0 | 1 // 是否支持手动新增
    type: 0 | 1 // 0=规格 1=参数
}

// ============ Product Types ============
export interface Product {
    id?: number
    brandId: number
    productCategoryId: number
    feightTemplateId: number
    productAttributeCategoryId: number
    name: string
    pic: string
    productSn: string
    deleteStatus: 0 | 1
    publishStatus: 0 | 1
    newStatus: 0 | 1
    recommendStatus: 0 | 1
    verifyStatus: 0 | 1
    sort: number
    sale: number
    price: number
    promotionPrice?: number
    giftGrowth: number
    giftPoint: number
    usePointLimit: number
    subTitle: string
    description: string
    originalPrice: number
    stock: number
    lowStock: number
    unit: string
    weight: number
    previewStatus: 0 | 1
    serviceIds: string
    keywords: string
    note: string
    albumPics: string
    detailTitle: string
    detailDesc: string
    detailHtml: string
    detailMobileHtml: string
    promotionStartTime?: string
    promotionEndTime?: string
    promotionPerLimit: number
    promotionType: 0 | 1 | 2 | 3 | 4
    brandName?: string
    productCategoryName?: string
    // Relations
    productLadderList?: ProductLadder[]
    productFullReductionList?: ProductFullReduction[]
    memberPriceList?: MemberPrice[]
    skuStockList?: SkuStock[]
    productAttributeValueList?: ProductAttributeValue[]
    subjectProductRelationList?: SubjectProductRelation[]
    prefrenceAreaProductRelationList?: PrefrenceAreaProductRelation[]
}

// ============ Product Related Types ============
export interface ProductLadder {
    id?: number
    productId?: number
    count: number
    discount: number
    price: number
}

export interface ProductFullReduction {
    id?: number
    productId?: number
    fullPrice: number
    reducePrice: number
}

export interface MemberPrice {
    id?: number
    productId?: number
    memberLevelId: number
    memberPrice: number
    memberLevelName?: string
}

export interface SkuStock {
    id?: number
    productId?: number
    skuCode: string
    price: number
    stock: number
    lowStock: number
    pic: string
    sale?: number
    promotionPrice?: number
    lockStock?: number
    spData: string // JSON string for spec data
}

export interface ProductAttributeValue {
    id?: number
    productId?: number
    productAttributeId: number
    value: string
}

export interface SubjectProductRelation {
    id?: number
    productId?: number
    subjectId: number
}

export interface PrefrenceAreaProductRelation {
    id?: number
    productId?: number
    prefrenceAreaId: number
}
