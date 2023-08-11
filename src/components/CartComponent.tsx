import React, {FC, useEffect} from 'react';
import {Card, CircularProgress} from "@mui/material";
import Paragraph from "@/components/ui/Paragraph";
import CloseIcon from "@mui/icons-material/Close";
import LineCustom from "@/components/ui/LineCustom";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import DoDisturbSharpIcon from '@mui/icons-material/DoDisturbSharp';
import {
    addToCartAPI,
    bookingAPI,
    deleteAllValueCartAPI,
    deleteOneValueCartByTourIdOfUserIdAPI,
    getToCartAPI
} from "@/util/api/apiReuqest";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useSelector} from "react-redux";
import {CartDTO} from "@/types";
import Link from "next/link";

interface CartProps {
    toggleCart: () => void;
}

//bang

const CartComponent: FC<CartProps> = ({toggleCart}) => {
    const accessToken = useSelector((state) => state.auth.value?.token.access)
    const userId = useSelector((state) => state.auth.value?.user.id)
    const [cartDataDelete, setCartDataDelete] = React.useState<CartDTO>()
    const [cart, setCart] = React.useState<CartDTO[]>();


    const {data: cartData, isLoading, isError, isSuccess} = useQuery(['cart', userId], () =>
        getToCartAPI(accessToken, userId)
    );
    // const queryClient = useQueryClient();

    // const addToCartMutation = useMutation((tourId) => addToCartAPI(accessToken, userId, tourId), {
    //     onSuccess: () => {
    //         queryClient.invalidateQueries(['cart', userId]);
    //     },
    // });
    // isLoading:isLoadingDeleteAll, isError:isErrorDeleteAll, isSuccess:isSuccessDeleteAll
    const {mutate: mutateDeleteAValueOfCart,data:dataCartDelete, isLoading: isLoadingDeleteAValueOfCart, status, isSuccess:isSuccessDeleteAValueOfCart} = useMutation(
        async (tourId:string) => {
            try {
                const res = await deleteOneValueCartByTourIdOfUserIdAPI(tourId, accessToken, userId,)
                return res;
            } catch (error) {
                throw error;
            }
        }, {
            onSuccess: () => {
                setCartDataDelete(dataCartDelete)
            },
            onError: (error) => {

            },
        });
    const { mutate:mutateDeleteAll,isLoading:isLoadingDeleteAll, isError:isErrorDeleteAll, isSuccess:isSuccessDeleteAll} = useMutation(
        async () => {
            try {
                const res = await deleteAllValueCartAPI(accessToken, userId)
                return res;
            } catch (error) {
                throw error;
            }
        }, {
            onSuccess: () => {
                // setCartDataDelete(dataCartDelete)
                return setCart([])
            },
            onError: (error) => {

            },
        });
    // React.useEffect(()=>{
    //     if(isSuccessDeleteAll) {
    //         setCart([])
    //     }
    // },[isSuccessDeleteAll])
    React.useEffect(() => {
        if (isSuccessDeleteAValueOfCart) {
            const data = cart?.filter((item) => item.tourId !== dataCartDelete?.tourId)
            setCart(data);
        }
    }, [cart, dataCartDelete?.tourId, isSuccessDeleteAValueOfCart]);
    React.useEffect(() => {
        if (isSuccess) {
            setCart(cartData);
        }
    }, [cartData, isSuccess]);

    const handleDeleteAValueInCart = (tourId:string) => {
        mutateDeleteAValueOfCart(tourId)
    }
    const handleDeleteAll = () => {
        mutateDeleteAll()
    }
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    }
    const optionsMoney: Intl.NumberFormatOptions =
        {style: 'currency', currency: 'VND'}

    // const overlayStyle:React.CSSProperties = {
    //     backgroundColor: 'rgba(0, 0, 0, 0.4)',
    //     position: 'absolute',
    //     top: 0,
    //     left: 0,
    //     zIndex:10,
    //     width: '100%',
    //     height: '100%',
    // };
    return (
        <section className={'absolute opacity-95 top-[100%] z-[1300] right-0 w-[100%] nh:w-[40%] nh:right-[5%] lg:right-[10%]'}>
            <Card
                variant="outlined"
                sx={{
                    maxHeight: 'max-content',
                    width: '100%',
                    borderRadius: '10px',
                    // mx: 'auto',
                    padding: '1rem',
                    backgroundColor: '#c0c0c0',
                    height: {xs: '100vh', md: '40vh'},
                    overflow: 'auto',
                    resize: 'none',
                    paddingBottom: '12px',
                }}
            >
                <div className={'flex justify-between mb-4'}>
                    <Paragraph size={'md'} className={'text-white font-bold nh:hidden'}>
                        <ShoppingCartIcon sx={{fontSize: '2rem'}}/>
                    </Paragraph>
                    <CloseIcon sx={{color: 'white', fontSize: '2rem', cursor:'pointer',
                        transition: 'color 0.3s',
                        '&:hover': {
                            color: 'red',
                    }} } onClick={toggleCart}/>
                </div>
                <div className={'w-full flex justify-center mb-4'}>
                    <div style={{backgroundColor: 'black', width: `100%`, height: '1px'}}></div>
                </div>
                <div className={'overflow-hidden'}>
                    <table className="table-fixed min-w-full text-left text-[12px]">
                        <thead>
                        <tr className={'text-left'}>
                            <th scope="col" className="px-2">Name</th>
                            <th scope="col" className="px-2">Start Day</th>
                            <th scope="col" className="px-2">Price</th>
                            <th scope="col" className="px-2">Booking</th>
                            <th scope="col" className="px-2">Remove</th>
                        </tr>
                        </thead>
                        {isLoading ? <div
                            className={'flex justify-center w-screen items-center absolute z-100 h-screen bg-light'}>
                            <CircularProgress color="secondary"/>
                        </div> : (
                            <tbody className={'text-white'}>
                            {cart && cart?.map((item) => {
                                const current = new Date()
                                const lastRegister = new Date(item.tour.lastRegisterDate)
                                const startDate = new Date(item.tour.startDate)
                                const formatDate = startDate.toLocaleDateString('es-uk', options)
                                const formatPrice = item.tour.price.toLocaleString('vi-VN', optionsMoney)
                                return (
                                    <>
                                        {item.tour.status !== 'available' ?
                                            <>
                                            <tr className={'relative '}  key={item.id}>
                                                <td className={'px-2 pb-2'}>{item.tour.name}</td>
                                                <td className={'px-2'}>{formatDate}</td>
                                                <td className={'px-2'}>{formatPrice}</td>
                                                <td className={'px-2'}>
                                                    <div className="flex">
                                                        <Paragraph className={'font-bold text-black cursor-default'}  size={'sx'}> sold out</Paragraph>
                                                    </div>
                                                </td>
                                                <td className={'px-2 z-[1000]'}>
                                                    <div className="flex justify-center">
                                                        <DeleteOutlinedIcon sx={{
                                                            fontSize: '18px',
                                                            color: 'black',
                                                            transition: 'color 0.3s',
                                                            cursor: 'pointer',
                                                            '&:hover': {
                                                                color: 'red',
                                                            },
                                                        }} onClick={()=>handleDeleteAValueInCart(item.tourId)}/>
                                                    </div>
                                                </td>
                                            </tr>
                                            </>
                                            :
                                            <tr key={item.id}>
                                                <td className={'px-2 pb-2'}>{item.tour.name}</td>
                                                <td className={'px-2'}>{formatDate}</td>
                                                <td className={'px-2'}>{formatPrice}</td>
                                                <td className={'px-2'}>
                                                    <div className="flex justify-center">
                                                        <Link href={`/booking/${item.tourId}`}>
                                                            <InventoryOutlinedIcon
                                                                sx={{
                                                                    fontSize: '18px',
                                                                    color: 'black',
                                                                    transition: 'color 0.3s',
                                                                    cursor: 'pointer',
                                                                    '&:hover': {
                                                                        color: 'blue',
                                                                    },
                                                                }}
                                                            />
                                                        </Link>
                                                    </div>
                                                </td>
                                                <td className={'px-2'}>
                                                    <div className="flex justify-center">
                                                        <DeleteOutlinedIcon sx={{
                                                            fontSize: '18px',
                                                            color: 'black',
                                                            transition: 'color 0.3s',
                                                            cursor: 'pointer',
                                                            '&:hover': {
                                                                color: 'red',
                                                            },
                                                        }} onClick={()=>handleDeleteAValueInCart(item.tourId)}/>
                                                    </div>
                                                </td>
                                            </tr>
                                        }
                                    </>
                                )
                            })}
                            </tbody>
                        )
                        }
                    </table>
                </div>
                <div className={'w-full flex justify-center mb-4'}>
                    <div style={{backgroundColor: 'black', width: `100%`, height: '1px'}}></div>
                </div>
                {cart?.length> 0 ? <div className={'flex justify-end'}>
                    <button onClick={() => handleDeleteAll() }
                            className="bg-white hover:bg-red-400 hover:text-white text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow">
                        Remove All
                    </button>
                </div>
                :
                    <div className={'flex justify-center items-center text-white'}> Cart Null</div>
                }
            </Card>
        </section>
    );
}
export default CartComponent;