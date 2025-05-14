import { useTranslations } from "next-intl";
import { FC } from "react";
import './style.css'

type Panel = {
    id: string
    name: string
    type: string
    url: string
    weight: number
}

export const LocationItem: FC<Panel> = ({ id, name, type, url, weight }: Panel) => {
    const t = useTranslations('i18n');

    return (
        <div onClick={() => { }} className='yarim-section'>
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