import { useTranslations } from "next-intl";
import { FC } from "react";
import './style.css'
import { useRouter } from "next/navigation";

type Panel = {
    id: string
    name: string
    type: string
    url: string
    weight: number
    routeUrl?: string
}

export const LocationItem: FC<Panel> = ({ id, name, type, url, weight, routeUrl }: Panel) => {
    const t = useTranslations('i18n');

    const router = useRouter();

    return (
        <div onClick={() => { router.push(routeUrl ?? ('/product?panel=' + id)) }} className='yarim-section'>
            <div>
                <div className='flex' key={id}>
                    <div>
                        <p>{name}</p>
                        <span className="description"></span>
                    </div>
                    <br />
                </div>
            </div>
        </div>
    )
}