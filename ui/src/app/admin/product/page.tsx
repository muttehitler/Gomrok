'use client';

import { useTranslations } from 'next-intl';
import { Page } from '@/components/Page';
import './style.css'
import { Toaster } from 'react-hot-toast';
import { AddProduct } from '@/components/addProduct/addProduct';
import { ProductList } from '@/components/productList/productList';

export default function Product() {
    const t = useTranslations('i18n');

    return (
        <Page back={true}>
            <Toaster position="top-right" reverseOrder={false} />
            <AddProduct />
            <ProductList />
        </Page>
    );
}
