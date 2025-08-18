"use server";

export async function Top() {
    return (<div style={{ minHeight: process.env.TOP ?? '0px' }}></div>)
};
