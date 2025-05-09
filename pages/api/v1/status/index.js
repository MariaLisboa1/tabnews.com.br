function status(request, response) {
  response.status(200).json({ chave: "acima de média" });
}

export default status;
