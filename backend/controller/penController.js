import Pen from "../models/penModel.js";

export const createPen = async (req, res) => {
  try {
    const body = req.body;
    if (!body.title || !body.brand || !body.publishYear) {
      return res.status(400).send({
        message: "Fill all required fields",
      });
    }
    const result = await Pen.create(body);
    return res.status(200).send({ result });
  } catch (error) {
    console.log(error);
    res.status(500).send("amjiltgui");
  }
};

export const getAllPens = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const pens = await Pen.find().skip(skip).limit(limit);
    const count = await Pen.countDocuments();
    res.status(200).json({
      data: pens,
      count: count,
    });
  } catch (err) {
    res.status(500).json({ error: "Алдаа гарлаа", message: err.message });
  }
};

export const getPenById = async (req, res) => {
  try {
    const { id } = req.params;
    const pen = await Pen.findById(id);
    if (!pen) {
      return res.status(404).send("oldsongu");
    }
    return res.status(200).send(pen);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message:error.message +  "Failed"});
  }
};

export const updatePen = async (req, res) => {
  try {
    const body = req.body;
    if (!body.title || !body.brand || !body.publishYear) {
      return res.status(400).send({
        message: "talbariig nuh",
      });
    }
    const { id } = req.params;
    const result = await Pen.findByIdAndUpdate(id, req.body);

    if (!result) {
      return res.status(404).send({
        message: "oldsongu",
      });
    }
    return res.status(200).send({
      message: "amjilttai",
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

export const deletePen = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Pen.findByIdAndDelete(id, req.body);

    if (!result) {
      res.status(400).send({
        message: "buruu id",
      });
    }
    return res.status(200).send({
      message: "amjilttai ustlaa",
    });
  } catch (error) {
    res.status(500).send({
      message: "aldaa",
    });
  }
};
