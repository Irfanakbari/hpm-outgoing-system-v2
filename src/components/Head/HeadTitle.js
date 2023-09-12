import {FaUserAlt} from "react-icons/fa";
import {BiSolidDownArrow} from "react-icons/bi";
import {useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import {useRouter} from "next/router";
import ConfirmLogoutModal from "@/components/Modal/ConfirmLogoutModal";
import Image from "next/image";
import {showErrorToast, showSuccessToast} from "@/utils/toast";
import {Dropdown} from "antd";

export default function HeadTitle({user}) {
    const [closeModal, setCloseModal] = useState(false)
    const router = useRouter()

    async function logoutHandle() {
        try {
            await axios.get('/api/auth/logout').then(async () => {
                showSuccessToast('Logout Berhasil');
                await router.reload()
            })

        } catch (error) {
            showErrorToast(error.response.data['data']);
        }
    }

    return (
        <>
            {
                closeModal ?
                    <ConfirmLogoutModal setCloseModal={setCloseModal} action={logoutHandle} />
                    :
                    null
            }
            <div className={`w-full bg-[#00DD94] py-1.5 px-2 text-white flex flex-row justify-between items-center mb-2`}>
                <div className={`flex items-center gap-3`}>
                    <Image src={'/logo.png'} alt={'Logo'} width={90} height={80} />
                    <h2 className={`font-bold text-[14px]`}>PT VUTEQ INDONESIA - HPM Outgoing System</h2>
                </div>
                <div className={`hover:cursor-pointer`} >
                    <Dropdown
                        menu={{
                            items:[
                                {
                                    key:'Logout',
                                    label:'Logout',
                                    onClick: () => setCloseModal(true)
                                }
                            ]
                            // onClick: (d)=>setNewTab(d.key)
                        }}
                        placement="bottom"
                    >
                        <div className="flex flex-row items-center">
                            <FaUserAlt size={10} />
                            <h2 className="font-bold text-[14px] mx-2">
                                Halo, {user.username ?? "-"}
                            </h2>
                            <BiSolidDownArrow size={10} />
                        </div>
                    </Dropdown>
                </div>
            </div>
        </>
    )
}