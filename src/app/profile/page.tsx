import Link from "next/link";

export default function ProfilePage() {
    return (
        <div className="px-5">
            <div className="pt-15 flex justify-between items-center">
                <h1 className="text-3xl font-bold">Профиль</h1>
                <Link href="/profile/settings">
                    <svg className="h-12 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M259.1 73.5C262.1 58.7 275.2 48 290.4 48L350.2 48C365.4 48 378.5 58.7 381.5 73.5L396 143.5C410.1 149.5 423.3 157.2 435.3 166.3L503.1 143.8C517.5 139 533.3 145 540.9 158.2L570.8 210C578.4 223.2 575.7 239.8 564.3 249.9L511 297.3C511.9 304.7 512.3 312.3 512.3 320C512.3 327.7 511.8 335.3 511 342.7L564.4 390.2C575.8 400.3 578.4 417 570.9 430.1L541 481.9C533.4 495 517.6 501.1 503.2 496.3L435.4 473.8C423.3 482.9 410.1 490.5 396.1 496.6L381.7 566.5C378.6 581.4 365.5 592 350.4 592L290.6 592C275.4 592 262.3 581.3 259.3 566.5L244.9 496.6C230.8 490.6 217.7 482.9 205.6 473.8L137.5 496.3C123.1 501.1 107.3 495.1 99.7 481.9L69.8 430.1C62.2 416.9 64.9 400.3 76.3 390.2L129.7 342.7C128.8 335.3 128.4 327.7 128.4 320C128.4 312.3 128.9 304.7 129.7 297.3L76.3 249.8C64.9 239.7 62.3 223 69.8 209.9L99.7 158.1C107.3 144.9 123.1 138.9 137.5 143.7L205.3 166.2C217.4 157.1 230.6 149.5 244.6 143.4L259.1 73.5zM320.3 400C364.5 399.8 400.2 363.9 400 319.7C399.8 275.5 363.9 239.8 319.7 240C275.5 240.2 239.8 276.1 240 320.3C240.2 364.5 276.1 400.2 320.3 400z"/></svg>
                </Link>
            </div>
            <div className="flex flex-col items-start justify-center bg-background pt-10">
                <section>
                    <div className="flex justify-between items-center gap-6">
                        <div className="rounded-full size-28 bg-[url('/assets/example1.jpg')] bg-cover bg-center"></div>
                        <div className="gap-2 flex flex-col">
                            <p className="text-xl font-bold">@username <span>, @age</span></p>
                            <div className="w-fit rounded-full flex items-center justify-center gap-2 bg-[#2C2C2E] py-1.5 px-2">
                                <svg className="h-5 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M576 304C576 436.5 461.4 544 320 544C282.9 544 247.7 536.6 215.9 523.3L97.5 574.1C88.1 578.1 77.3 575.8 70.4 568.3C63.5 560.8 62 549.8 66.8 540.8L115.6 448.6C83.2 408.3 64 358.3 64 304C64 171.5 178.6 64 320 64C461.4 64 576 171.5 576 304z"/></svg>
                                <p className="text-white">Ищу общения</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="pt-4 flex flex-col gap-4 w-full pb-10">
                    <h2 className="text-2xl font-bold">Ваша анкета</h2>
                    <div className="rounded-4xl shadow-lg shadow-white/5 bg-[#0A0A0A]">
                        <div className="bg-[url('/assets/example1.jpg')] bg-cover bg-center w-full rounded-4xl p-6 aspect-4/6">
                            <div className="flex justify-between">
                                <div className="flex flex-col gap-2">
                                    <p className="text-xl font-bold">@username <span>, @age</span></p>
                                    <div className="w-fit rounded-full flex items-center justify-center gap-2 bg-[#2C2C2E] py-1.5 px-2">
                                        <svg className="h-5 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M576 304C576 436.5 461.4 544 320 544C282.9 544 247.7 536.6 215.9 523.3L97.5 574.1C88.1 578.1 77.3 575.8 70.4 568.3C63.5 560.8 62 549.8 66.8 540.8L115.6 448.6C83.2 408.3 64 358.3 64 304C64 171.5 178.6 64 320 64C461.4 64 576 171.5 576 304z"/></svg>
                                        <p className="text-white">Ищу общения</p>
                                    </div>
                                    <div className="w-fit rounded-full flex items-center justify-center gap-2 bg-[#2C2C2E] py-1.5 px-2">
                                        <svg 
                                            className="h-5 fill-white"
                                            xmlns="http://www.w3.org/2000/svg" 
                                            viewBox="0 0 640 640">
                                            <path d="M128 252.6C128 148.4 214 64 320 64C426 64 512 148.4 512 252.6C512 371.9 391.8 514.9 341.6 569.4C329.8 582.2 310.1 582.2 298.3 569.4C248.1 514.9 127.9 371.9 127.9 252.6zM320 320C355.3 320 384 291.3 384 256C384 220.7 355.3 192 320 192C284.7 192 256 220.7 256 256C256 291.3 284.7 320 320 320z"/>
                                        </svg>
                                        <p className="text-white">Ижевск</p>
                                    </div>
                                </div>
                                <Link href="/profile/edit">
                                    <svg className="h-9 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M416.9 85.2L372 130.1L509.9 268L554.8 223.1C568.4 209.6 576 191.2 576 172C576 152.8 568.4 134.4 554.8 120.9L519.1 85.2C505.6 71.6 487.2 64 468 64C448.8 64 430.4 71.6 416.9 85.2zM338.1 164L122.9 379.1C112.2 389.8 104.4 403.2 100.3 417.8L64.9 545.6C62.6 553.9 64.9 562.9 71.1 569C77.3 575.1 86.2 577.5 94.5 575.2L222.3 539.7C236.9 535.6 250.2 527.9 261 517.1L476 301.9L338.1 164z"/></svg>
                                </Link>
                            </div>
                        </div>
                        <section className="p-6 flex flex-col gap-5 pb-14">
                            <div className="flex flex-col gap-1.5">
                                <h1 className="text-lg font-bold text-[#8E8E93]">Обо мне</h1>
                                <p className="text-lg">Люблю гулять и бегать под дождём! Присоединишься?</p>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <h1 className="text-lg font-bold text-[#8E8E93]">Должность</h1>
                                <p className="text-lg">HR-менеджер</p>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <h1 className="text-lg font-bold text-[#8E8E93]">Меня интересует</h1>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="w-fit rounded-lg flex items-center justify-center gap-2 bg-[#2C2C2E] py-1.5 px-3.5">
                                        <svg className="h-5 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M213.1 128.8L202.7 160L128 160C92.7 160 64 188.7 64 224L64 480C64 515.3 92.7 544 128 544L512 544C547.3 544 576 515.3 576 480L576 224C576 188.7 547.3 160 512 160L437.3 160L426.9 128.8C420.4 109.2 402.1 96 381.4 96L258.6 96C237.9 96 219.6 109.2 213.1 128.8zM320 256C373 256 416 299 416 352C416 405 373 448 320 448C267 448 224 405 224 352C224 299 267 256 320 256z"/></svg>
                                        <p className="text-white">Фото</p>
                                    </div>
                                    <div className="w-fit rounded-lg flex items-center justify-center gap-2 bg-[#2C2C2E] py-1.5 px-3.5">
                                        <svg className="h-5 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M213.1 128.8L202.7 160L128 160C92.7 160 64 188.7 64 224L64 480C64 515.3 92.7 544 128 544L512 544C547.3 544 576 515.3 576 480L576 224C576 188.7 547.3 160 512 160L437.3 160L426.9 128.8C420.4 109.2 402.1 96 381.4 96L258.6 96C237.9 96 219.6 109.2 213.1 128.8zM320 256C373 256 416 299 416 352C416 405 373 448 320 448C267 448 224 405 224 352C224 299 267 256 320 256z"/></svg>
                                        <p className="text-white">Спорт</p>
                                    </div>
                                    <div className="w-fit rounded-lg flex items-center justify-center gap-2 bg-[#2C2C2E] py-1.5 px-3.5">
                                        <svg className="h-5 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M213.1 128.8L202.7 160L128 160C92.7 160 64 188.7 64 224L64 480C64 515.3 92.7 544 128 544L512 544C547.3 544 576 515.3 576 480L576 224C576 188.7 547.3 160 512 160L437.3 160L426.9 128.8C420.4 109.2 402.1 96 381.4 96L258.6 96C237.9 96 219.6 109.2 213.1 128.8zM320 256C373 256 416 299 416 352C416 405 373 448 320 448C267 448 224 405 224 352C224 299 267 256 320 256z"/></svg>
                                        <p className="text-white">Фото</p>
                                    </div>
                                    <div className="w-fit rounded-lg flex items-center justify-center gap-2 bg-[#2C2C2E] py-1.5 px-3.5">
                                        <svg className="h-5 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M213.1 128.8L202.7 160L128 160C92.7 160 64 188.7 64 224L64 480C64 515.3 92.7 544 128 544L512 544C547.3 544 576 515.3 576 480L576 224C576 188.7 547.3 160 512 160L437.3 160L426.9 128.8C420.4 109.2 402.1 96 381.4 96L258.6 96C237.9 96 219.6 109.2 213.1 128.8zM320 256C373 256 416 299 416 352C416 405 373 448 320 448C267 448 224 405 224 352C224 299 267 256 320 256z"/></svg>
                                        <p className="text-white">Фото</p>
                                    </div>
                                    <div className="w-fit rounded-lg flex items-center justify-center gap-2 bg-[#2C2C2E] py-1.5 px-3.5">
                                        <svg className="h-5 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M213.1 128.8L202.7 160L128 160C92.7 160 64 188.7 64 224L64 480C64 515.3 92.7 544 128 544L512 544C547.3 544 576 515.3 576 480L576 224C576 188.7 547.3 160 512 160L437.3 160L426.9 128.8C420.4 109.2 402.1 96 381.4 96L258.6 96C237.9 96 219.6 109.2 213.1 128.8zM320 256C373 256 416 299 416 352C416 405 373 448 320 448C267 448 224 405 224 352C224 299 267 256 320 256z"/></svg>
                                        <p className="text-white">Фото</p>
                                    </div>
                                    <div className="w-fit rounded-lg flex items-center justify-center gap-2 bg-[#2C2C2E] py-1.5 px-3.5">
                                        <svg className="h-5 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M213.1 128.8L202.7 160L128 160C92.7 160 64 188.7 64 224L64 480C64 515.3 92.7 544 128 544L512 544C547.3 544 576 515.3 576 480L576 224C576 188.7 547.3 160 512 160L437.3 160L426.9 128.8C420.4 109.2 402.1 96 381.4 96L258.6 96C237.9 96 219.6 109.2 213.1 128.8zM320 256C373 256 416 299 416 352C416 405 373 448 320 448C267 448 224 405 224 352C224 299 267 256 320 256z"/></svg>
                                        <p className="text-white">Фото</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </section>
            </div>
        </div>
    );
}