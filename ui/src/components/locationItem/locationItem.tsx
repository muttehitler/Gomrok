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
}

export const LocationItem: FC<Panel> = ({ id, name, type, url, weight }: Panel) => {
    const t = useTranslations('i18n');

    const router = useRouter();

    return (
        <div onClick={() => { router.push('/product?panel=' + id) }} className='yarim-section'>
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