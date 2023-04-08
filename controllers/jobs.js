const UserModel = require("../models/User");
const JobModel = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const Job = require("../models/Job");

const getAllJobs = async (req, res) => {
  const job = await JobModel.find({ createdBy: req.user.userID }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ msg: "Success get job", job });
};

const getJob = async (req, res) => {
  const {
    user: { userID, email },
    params: { id: jobId },
  } = req;
  const getJob = await JobModel.findOne({ _id: jobId, createdBy: userID });
  if (!getJob) {
    throw new NotFoundError(`No job with email ${email} and  ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ getJob, count: getJob.length });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userID;
  const addJob = await JobModel.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ msg: "Success add job", addJob });
};

const updateJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobId },
    body: { company, position },
  } = req;
  if (company == "" || position == "") {
    throw new BadRequestError("Company atau position harus diisi");
  }
  const updatedJob = await JobModel.findByIdAndUpdate(
    { _id: jobId, createdBy: userID },
    req.body,
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.ACCEPTED).json({ updatedJob });
};

const deleteJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userID },
  } = req;
  const removeJob = await JobModel.findByIdAndRemove({
    _id: jobId,
    createdBy: userID,
  });
  if (!removeJob) {
    throw new BadRequestError("No job found");
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: `Success removed ${jobId} from user=${userID}` });
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
