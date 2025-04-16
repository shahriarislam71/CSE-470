

const Banner = () => {
    return (
        <div className='ms-5 mt-8 rounded-lg flex justify-between background'>
            <div className=''>
                <p className='pl-4 pt-9 text-white text-lg'>4 september, 2025</p>
                <p className='pl-4 pt-14 mt-4 text-white text-2xl font-semibold'>Welcome Back, Jonh</p>
                <p className='pl-4 text-white'>Always Stay updated in your Student Portal</p>
            </div>
            <div className='flex justify-end'>
                <img className='w-3/4' src="https://media.istockphoto.com/id/1438185814/photo/college-student-asian-man-and-studying-on-laptop-at-campus-research-and-education-test-exam.jpg?s=612x612&w=0&k=20&c=YmnXshbaBxyRc4Nj43_hLdLD5FLPTbP0p_3-uC7sjik=" alt="" />
            </div>
        </div>
    );
};

export default Banner;