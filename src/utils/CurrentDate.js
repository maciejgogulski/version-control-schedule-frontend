import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'

const CurrentDate = () => {
    const {t, i18n} = useTranslation();
    const [currentDate, setCurrentDate] = useState('')

    useEffect(() => {
        const getFormattedDate = () => {
            const months = {
                en: [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ],
                pl: [
                    "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
                    "lipca", "sierpnia", "września", "października", "listopada", "grudnia"
                ]
            }

            const currentDateObj = new Date()
            const day = currentDateObj.getDate()
            const monthIndex = currentDateObj.getMonth()
            const month = months[i18n.language][monthIndex]
            const year = currentDateObj.getFullYear()

            return t('date.format', {day, month, year})
        };

        setCurrentDate(getFormattedDate())
    }, [i18n.language, t])

    return (
        <div >{currentDate}</div>
    )
}

export default CurrentDate;
