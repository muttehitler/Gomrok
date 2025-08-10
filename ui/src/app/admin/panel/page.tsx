'use client';

import { Page } from '@/components/Page';
import { AddPanel } from '@/components/addPanel/addPanel';
import { PanelList } from '@/components/panelList/panelList';
import { Toaster } from "@/components/ui/toaster";

export default function PanelPage() {
    return (
        <Page back={true}>
            <div className="p-4 md:p-6 space-y-4">
                <AddPanel />
                <PanelList />
            </div>
            <Toaster />
        </Page>
    );
}