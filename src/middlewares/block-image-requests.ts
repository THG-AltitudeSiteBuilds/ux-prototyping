const blockImageRequests = async (context, next) => {
    if(context?.url?.pathname === '/_image') {
        return new Response(null, { status: 404 })
    }
    return next();
};

export default blockImageRequests