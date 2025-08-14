"use client";

import {
    Pagination as ShadcnPagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Dispatch, FC, SetStateAction } from "react";

type PaginationProps = {
    pageCount: number;
    currentPageState: [number, Dispatch<SetStateAction<number>>];
};

export const Pagination: FC<PaginationProps> = ({
    pageCount,
    currentPageState,
}) => {
    const [currentPage, setCurrentPage] = currentPageState;

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < pageCount) {
            setCurrentPage(currentPage + 1);
        }
    };

    const renderPageNumbers = () => {
        const pages: JSX.Element[] = [];
        const windowSize = 1;

        const firstPages = [1];
        const lastPages = [pageCount];
        const middlePages = [];

        for (
            let i = currentPage - windowSize;
            i <= currentPage + windowSize;
            i++
        ) {
            if (i > 0 && i <= pageCount) {
                middlePages.push(i);
            }
        }

        const allPages = Array.from(
            new Set([...firstPages, ...middlePages, ...lastPages])
        ).sort((a, b) => a - b);

        let prevPage = 0;
        allPages.forEach((page) => {
            if (page - prevPage > 1) {
                pages.push(
                    <PaginationItem key={`ellipsis-${page}`}>
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
            pages.push(
                <PaginationItem key={page}>
                    <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                        }}
                    >
                        {page}
                    </PaginationLink>
                </PaginationItem>
            );
            prevPage = page;
        });

        return pages;
    };

    if (pageCount <= 1) {
        return null;
    }

    return (
        <ShadcnPagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href="#" onClick={handlePrevious} />
                </PaginationItem>
                {renderPageNumbers()}
                <PaginationItem>
                    <PaginationNext href="#" onClick={handleNext} />
                </PaginationItem>
            </PaginationContent>
        </ShadcnPagination>
    );
};
