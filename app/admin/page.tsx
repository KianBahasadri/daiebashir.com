import React from 'react'
import Script from 'next/script'

const page = () => {
    return (
        <div className='space-y-16 text-center'>
            <div className="space-x-4">
                <h3>Enter Admin Password</h3>
                <form>
                    <input type="text" className="border rounded-lg" />
                    <button className="cursor-pointer text-white p-1 bg-gray-700 hover:bg-gray-500 rounded-lg" id="admin-password-submit">Submit</button>
                </form>
                <Script>
                    {`
                    document.getElementById('admin-password-submit').addEventListener('click', (event) => {
                        event.preventDefault();
                        const password = document.querySelector('input[type="text"]').value;
                        document.cookie = \`admin-password=\${password}; path=/api/; Secure; SameSite=Strict\`;
                        document.querySelector('input[type="text"]').value = '';
                    });
                `}
                </Script>
            </div>
            <div>
                <h1>Add Base Image</h1>
                <form action="/api/addbaseimage" method="post" encType="multipart/form-data">
                    <input name="image" type="file" accept="image/*" className="block w-full text-sm text-gray-100 border border-gray-600 rounded-lg cursor-pointer bg-gray-800 focus:outline-none" />
                    <input name="description" type="text" placeholder="Image Description" className="border rounded-lg ml-4 p-1" />
                    <button className="cursor-pointer text-white p-1 bg-gray-700 hover:bg-gray-500 rounded-lg">Upload</button>
                </form>
            </div>
        </div>
    )
}

export default page