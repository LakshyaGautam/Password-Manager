import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    const ref = useRef()
    const passwordRef = useRef()
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setpasswordArray] = useState([])

    const getPasswords = async () => {
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json()
        console.log(passwords)
        setpasswordArray(passwords)
    }


    useEffect(() => {
        getPasswords()
    }, []);



    const showPassword = () => {
        console.log(ref.current.src)
        if (ref.current.src.includes("hidden.png")) {
            passwordRef.current.type = "password"
            ref.current.src = "eye.png"
        }
        else {
            passwordRef.current.type = "text"
            ref.current.src = "hidden.png"
        }
    }

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            const id = form.id || uuidv4();

            if (form.id) {
                await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-type": "application/json" }, body: JSON.stringify({ id: form.id }) })
            }

            const newPassword = { ...form, id };

            let res = await fetch("http://localhost:3000/", { method: "POST", headers: { "Content-type": "application/json" }, body: JSON.stringify(newPassword) })

            if (res.ok) {
                setpasswordArray([...passwordArray, newPassword])
                // localStorage.setItem("passwords", JSON.stringify([...passwordArray, { ...form, id: uuidv4() }]))
                // console.log([...passwordArray, form])
                setform({ site: "", username: "", password: "" })
                toast('Password saved!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
        }
        else {
            toast('Error: Password not saved!');
        }
    }

    const deletePassword = async (id) => {
        let c = confirm("Do you really want to delete this password")
        if (c) {
            console.log("Deleting password with id", id);
            setpasswordArray(passwordArray.filter(item => item.id !== id))
            // localStorage.setItem("passwords", JSON.stringify(passwordArray.filter(item => item.id !== id)))
            let res = await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-type": "application/json" }, body: JSON.stringify({ id }) })

            if (res.ok) {
                console.log("Password deleted successfully");
                setpasswordArray(passwordArray.filter(item => item.id !== id));
                toast('Password deleted!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
        }
    }

    const editPassword = (id) => {
        console.log("Editing password with id", id)
        setform({ ...passwordArray.filter(i => i.id === id)[0], id: id })
        setpasswordArray(passwordArray.filter(i => i.id !== id))
    }

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }


    const copytext = (text) => {
        toast('Copied to clipboard!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        navigator.clipboard.writeText(text);
    }



    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition="Bounce" />
            {/* Same as */}
            <ToastContainer />
            <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div></div>

            <div className="p-3 md:mycontainer min-h-[84.9vh]">
                <h1 className="font-bold text-4xl text-center">
                    <span className="text-green-500">&lt;</span>
                    Pass
                    <span className="text-green-500">OP/&gt;</span></h1>
                <p className="text-green-900 text-center text-lg">Your own Password Manager</p>

                <div className="text-black flex flex-col p-4 gap-5 items-center">
                    <input value={form.site} onChange={handleChange} placeholder="Enter website URL" className="rounded-full border border-green-500 w-full px-4 py-1" type="text"
                        name="site" id="site" />

                    <div className="flex flex-col md:flex-row w-full gap-8">
                        <input value={form.username} onChange={handleChange} placeholder="Enter Username" className="rounded-full border border-green-500 
                        w-full px-4 py-1" type="text" name="username" id="username" />

                        <div className="relative">

                            <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder="Enter Password" className="rounded-full border border-green-500 w-full px-4 py-1" type="password" name="password" id="password" />
                            <span className="absolute right-2 top-2 cursor-pointer" onClick={showPassword}>
                                <img ref={ref} width={21} src="eye.png" alt="" />
                            </span>
                        </div>

                    </div>

                    <button onClick={savePassword} className="flex justify-center items-center bg-green-400 hover:bg-green-300
                    rounded-full px-8 py-2 w-fit gap-2 border border-green-900">
                        <lord-icon
                            src="https://cdn.lordicon.com/jgnvfzqg.json"
                            trigger="hover">
                        </lord-icon>
                        Save</button>
                </div>

                <div className="passwords pb-10">
                    <h2 className="font-bold text-2xl pb-2">Your Passwords</h2>
                    {passwordArray.length === 0 && <div>No passwords to show</div>}
                    {Array.isArray(passwordArray) && passwordArray.length !== 0 && <table className="table-auto w-full rounded-md overflow-hidden">
                        <thead className="text-white bg-green-800">
                            <tr>
                                <th className="py-2">Site</th>
                                <th className="py-2">Username</th>
                                <th className="py-2">Password</th>
                                <th className="py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-green-100">
                            {passwordArray.map((item, index) => {
                                return <tr key={index}>
                                    <td className=" py-2 border border-white text-center">
                                        <div className="flex justify-center items-center">
                                            <a href={item.site} target="_blank">{item.site}</a>
                                            <div className="lordiconcopy size-7 cursor-pointer" onClick={() => { copytext(item.site) }}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/depeqmsz.json"
                                                    trigger="hover"
                                                    style={{ "width": "25px", "height": "25px" }}>
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="flex-col py-2 border border-white text-center ">
                                        <div className="flex justify-center items-center">
                                            <span>{item.username}</span>
                                            <div className="lordiconcopy size-7 cursor-pointer" onClick={() => { copytext(item.username) }}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/depeqmsz.json"
                                                    trigger="hover"
                                                    style={{ "width": "25px", "height": "25px" }}>
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="flex justify-center border border-white py-2 text-center ">
                                        <div className="flex justify-center items-center">
                                            <span>{"*".repeat(item.password.length)}</span>
                                            <div className="lordiconcopy size-7 cursor-pointer" onClick={() => { copytext(item.password) }}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/depeqmsz.json"
                                                    trigger="hover"
                                                    style={{ "width": "25px", "height": "25px" }}>
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className=" py-2 border border-white text-center ">
                                        <span className="cursor-pointer mx-1" onClick={() => { editPassword(item.id) }}>
                                            <lord-icon
                                                src="https://cdn.lordicon.com/wuvorxbv.json"
                                                trigger="hover"
                                                stroke="bold"
                                                style={{ "width": "25px", "height": "25px" }}>
                                            </lord-icon>
                                        </span>
                                        <span className="cursor-pointer mx-1" onClick={() => { deletePassword(item.id) }}>
                                            <lord-icon
                                                src="https://cdn.lordicon.com/drxwpfop.json"
                                                trigger="hover"
                                                stroke="bold"
                                                style={{ "width": "25px", "height": "25px" }}>
                                            </lord-icon>
                                        </span>
                                    </td>
                                </tr>
                            })}

                        </tbody>
                    </table>}
                </div>

            </div>
        </>
    )
}

export default Manager