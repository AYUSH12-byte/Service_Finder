const successResponse = ({
  res,
  statusCode = 200,
  message = "Request successful",
  data = null,
  meta = null,
}) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

const createdResponse = ({
  res,
  message = "Resource created successfully",
  data = null,
}) => {
  return successResponse({
    res,
    statusCode: 201,
    message,
    data,
  });
};

module.exports = {
  successResponse,
  createdResponse,
};