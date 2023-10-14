'use client'
import * as React from 'react';
import {FC, useEffect} from "react";
import {Card} from "@mui/material";
import TableTour from "@/components/seller/table/TableTour";
import ModalCreateTour from "@/components/seller/modal/ModalCreateTour";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {useQueryClient} from "@tanstack/react-query";
import {useSelector} from "react-redux";

interface TourManagerProps {
}

const TourManager: FC<TourManagerProps> = ({}) => {
    const [page, setPage] = React.useState(1);
    const [totalPage, setTotalPage] = React.useState<number | undefined>();
    const userId = useSelector((state) => state.auth.value?.user.id)
    const accessToken = useSelector((state) => state.auth.value?.token.access)

    const queryClient = useQueryClient()
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };
    React.useEffect(()=>{
        queryClient.fetchQuery(['TourOfStore', userId])
    },[page])

    useEffect(() => {
        document.title = `Manager Tour`
    }, [])
    return (
        <Card
            variant="outlined"
            sx={{
                Height: '100vh',
                maxWidth: '100%',
                resize: 'none',
            }}
        >
            <section className={'w-full  pb-4'}>
                <div>
                    <ModalCreateTour/>
                </div>
                <div class="flex items-center justify-center">
                    <div class="overflow-x-scroll">
                        <div class=" w-[89vw] h-[70vh] lg:w-[80vw] ">
                            <TableTour page={page} userId={userId} setTotalPage={setTotalPage} accessToken={accessToken}/>
                        </div>
                    </div>
                </div>
                <Stack sx={{paddingTop:'12px'}} spacing={2}>
                    <Pagination sx ={{display:'flex',justifyContent:'center'}} count={Math.ceil(totalPage/10)} page={page} onChange={handleChange} />
                </Stack>
            </section>
        </Card>
    );
}
// <tr>

// </tr>
// </thead>
// <tbody>

// </tr>

export default TourManager;
