import React, {FC} from 'react';
import TourComponent from "@/components/TourComponent";

interface PageProps {
}

//bang

const Page: FC<PageProps> = ({}) => {
    return (
        <>
            <div className="lg:block"></div>
            <div className={'lg:col-span-2 col-span-4  w-6/6 p-3.5'}>
                <TourComponent/>
            </div>
        </>
    );
}

export default Page;