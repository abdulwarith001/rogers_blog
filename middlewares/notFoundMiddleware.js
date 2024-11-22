const notFound = (req, res) => {
  res.status(404).json({ message: "Invalid requested resource..." });
};

export default notFound;
