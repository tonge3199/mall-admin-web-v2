import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Layout } from '@/app/Layout'
import { AuthGuard } from '@/auth/guard'
import { HomePage } from '@/pages/Home'
import { LoginPage } from '@/pages/Login'
import { NotFoundPage } from '@/pages/NotFound'
// PMS imports
import { BrandListPage, BrandAddPage, BrandUpdatePage } from '@/pages/pms/brand'
import { ProductListPage, ProductAddPage, ProductUpdatePage } from '@/pages/pms/product'
import { ProductCategoryListPage, ProductCateAddPage, ProductCateUpdatePage } from '@/pages/pms/productCate'
import {
    ProductAttrCateListPage,
    ProductAttrListPage,
    ProductAttrAddPage,
    ProductAttrUpdatePage,
} from '@/pages/pms/productAttr'

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/',
        element: (
            <AuthGuard>
                <Layout />
            </AuthGuard>
        ),
        children: [
            { index: true, element: <Navigate to="/home" replace /> },
            { path: 'home', element: <HomePage /> },
            // PMS - Product Management System
            {
                path: 'pms',
                children: [
                    { index: true, element: <Navigate to="/pms/product" replace /> },
                    // Product
                    { path: 'product', element: <ProductListPage /> },
                    { path: 'product/add', element: <ProductAddPage /> },
                    { path: 'product/update', element: <ProductUpdatePage /> },
                    // Product Category
                    { path: 'productCate', element: <ProductCategoryListPage /> },
                    { path: 'productCate/add', element: <ProductCateAddPage /> },
                    { path: 'productCate/update', element: <ProductCateUpdatePage /> },
                    // Product Attribute Category (商品类型)
                    { path: 'productAttr', element: <ProductAttrCateListPage /> },
                    { path: 'productAttrList', element: <ProductAttrListPage /> },
                    { path: 'productAttr/add', element: <ProductAttrAddPage /> },
                    { path: 'productAttr/update', element: <ProductAttrUpdatePage /> },
                    // Brand
                    { path: 'brand', element: <BrandListPage /> },
                    { path: 'brand/add', element: <BrandAddPage /> },
                    { path: 'brand/update', element: <BrandUpdatePage /> },
                ],
            },
            // TODO: OMS - Order Management System
            // TODO: SMS - Sales & Marketing System
        ],
    },
    { path: '*', element: <NotFoundPage /> },
])
