const error500 = (res) => {
  res.status(500).json({
    msg: "Internal Server Error.",
    isSuccess: false,
    statusCode: 500,
  });
};

export default error500;
