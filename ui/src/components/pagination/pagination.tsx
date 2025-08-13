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
        const pages = [];
        for (let i = 1; i <= pageCount; i++) {
            pages.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        href="#"
                        isActive={i === currentPage}
                        onClick={() => setCurrentPage(i)}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }
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
