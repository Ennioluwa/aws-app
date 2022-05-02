const userById = (req, res) => {
  try {
    res.json({ message: "Hello from the user route" });
  } catch (err) {
    console.log(err);
  }
};
const postById = (req, res) => {
  try {
    res.json({ message: "Hello from the post route" });
  } catch (err) {
    console.log(err);
  }
};

export default { userById, postById };
