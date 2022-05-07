import { useState, useEffect, useCallback } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import { useSelector, useDispatch } from "react-redux";
import {
	updateUser,
	resetState,
} from "../../../features/authentication/authSlice";
import {
	PencilAltIcon,
	PencilIcon,
	ArrowLeftIcon,
	MailIcon,
	MailOpenIcon,
	LockClosedIcon,
	LockOpenIcon,
} from "@heroicons/react/outline";
import { toast } from "react-toastify";
import { Tooltip, Checkbox, FormControlLabel } from "@mui/material";

export default function AccountMenu({ open, handleClose }) {
	const dispatch = useDispatch();

	const { user } = useSelector((state) => state.auth);
	const { darkMode } = useSelector((state) => state.theme);
	const { updateError, message, isSuccess } = useSelector(
		(state) => state.auth
	);
	const [formData, setFormData] = useState({
		username: user.username,
		email: user.email,
		currentPassword: "",
		newPassword: "",
		confirmNewPassword: "",
	});
	const [editUsername, setEditUsername] = useState(false);
	const [editEmail, setEditEmail] = useState(false);
	const [editPassword, setEditPassword] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	function toggleEditUsername() {
		setEditUsername((prev) => !prev);
	}
	function toggleEditEmail() {
		setEditEmail((prev) => !prev);
	}
	function toggleEditPassword() {
		setEditPassword((prev) => !prev);
	}
	function cancelEditingAccountInfo() {
		setEditUsername(false);
		setEditEmail(false);
		setEditPassword(false);
	}
	function toggleShowPasswords() {
		setShowPassword((prev) => !prev);
	}

	const resetFormData = useCallback(() => {
		setFormData({
			username: user.username,
			email: user.email,
			currentPassword: "",
			newPassword: "",
			confirmNewPassword: "",
		});
	}, [setFormData, user.username, user.email]);
	function resetUsernameForm() {
		setFormData((prevData) => {
			return {
				...prevData,
				username: user.username,
			};
		});
	}
	function resetEmailForm() {
		setFormData((prevData) => {
			return {
				...prevData,
				email: user.email,
			};
		});
	}
	function resetPasswordForm() {
		setFormData((prevData) => {
			return {
				...prevData,
				currentPassword: "",
				newPassword: "",
				confirmNewPassword: "",
			};
		});
	}

	function handleFormData(e) {
		const { name, value } = e.target;

		setFormData((prevData) => {
			return {
				...prevData,
				[name]: value,
			};
		});
	}

	function handleSubmit(e) {
		e.preventDefault();

		if (user.username === "GuestAccount") {
			return toast.error(`GuestAccount's information cannot be edited.`);
		}
		if (
			user.username === formData.username &&
			user.email === formData.email &&
			formData.currentPassword === "" &&
			formData.newPassword === ""
		)
			return;

		if (formData.currentPassword === "" && formData.newPassword !== "") {
			return toast.info("Please enter current password.");
		}
		if (formData.currentPassword !== "" && formData.newPassword === "") {
			return toast.info("Please enter new password.");
		}
		if (
			formData.confirmNewPassword !== formData.newPassword &&
			formData.confirmNewPassword !== "" &&
			formData.newPassword !== ""
		) {
			return toast.warn("Confirmed and new passwords do not match, try again.");
		}

		const sentData = {
			username: formData.username,
			email: formData.email,
			currentPassword:
				formData.currentPassword === "" ? undefined : formData.currentPassword,
			newPassword:
				formData.newPassword === "" ? undefined : formData.newPassword,
		};

		dispatch(updateUser(sentData));
	}

	const displayError = useCallback(() => {
		if (updateError) {
			toast.error(message);
		}
	}, [message, updateError]);

	const displaySuccess = useCallback(() => {
		if (isSuccess) {
			toast.success("Your account has been updated");

			resetFormData();
		}
	}, [isSuccess, resetFormData]);

	const resetAfterUpdate = useCallback(() => {
		dispatch(resetState());
	}, [dispatch]);

	useEffect(() => {
		displaySuccess();
		displayError();

		return () => {
			resetAfterUpdate();
		};
	}, [displaySuccess, displayError, resetAfterUpdate]);

	const bgStyle = darkMode ? "bg-menu" : "bg-offwhite";
	const textStyle = darkMode ? "text-white" : "text-gray1";
	const titleStyle = darkMode
		? "text-white border-b-[1px] border-gray-500 "
		: "text-gray1 border-b-[1px] border-gray-300";
	const accountInfoStyle = darkMode
		? "text-white border-t-[1px] border-b-[1px] border-gray-500 hover:bg-slate-800 "
		: "text-gray1 border-t-[1px] border-b-[1px] border-gray-300 hover:bg-gray-100 ";
	const formStyle = darkMode
		? "border-[1px] border-gray-500 "
		: "border-[1px] border-gray-300 ";
	const returnStyle = darkMode ? "hover:bg-dark4" : "hover:bg-gray-200";

	return (
		<>
			<Dialog
				open={open}
				fullWidth={true}
				maxWidth="sm"
				onClose={() => {
					handleClose();
					resetFormData();
					cancelEditingAccountInfo();
				}}
			>
				<div className={`w-full py-6 px-8 ${bgStyle} `}>
					<div className={`${textStyle} mb-6 py-2`}>
						<h1
							className={`${titleStyle} text-xl font-semibold pb-2 font-sans `}
						>
							Manage Account
						</h1>
					</div>

					<div className="">
						<div>
							{!editUsername ? (
								<Tooltip
									arrow
									describeChild
									placement="right"
									title="Edit Username"
								>
									<div
										className={`flex gap-4 items-center py-[.84rem] px-4 w-full mb-6 cursor-pointer
											${accountInfoStyle}`}
										onClick={toggleEditUsername}
									>
										<div className="flex basis-32 items-center">
											<p className="text-xs leading-6 uppercase font-medium">
												Username
											</p>
										</div>
										<div className="flex basis-96">
											<p className="text-base">{user.username}</p>
										</div>
										<PencilIcon className="h-7 w-7" />
									</div>
								</Tooltip>
							) : (
								<div className={`flex flex-col mb-6 py-4 px-6 ${formStyle}`}>
									<div className="flex items-center justify-between">
										<Tooltip arrow describeChild title="Click to go back">
											<button
												onClick={() => {
													resetUsernameForm();
													toggleEditUsername();
												}}
											>
												<ArrowLeftIcon
													className={`h-9 w-9 rounded-full p-2 ${returnStyle}`}
												/>
											</button>
										</Tooltip>
										<PencilAltIcon className="h-6 w-6" />
									</div>
									<TextField
										name="username"
										value={formData.username}
										onChange={handleFormData}
										margin="normal"
										id="username"
										label="Username"
										type="text"
										fullWidth
										variant="outlined"
									/>
								</div>
							)}

							{!editEmail ? (
								<Tooltip
									arrow
									describeChild
									placement="right"
									title="Edit Email"
								>
									<div
										className={`flex gap-4 mb-6 items-center px-4 py-[.81rem] w-full cursor-pointer
											${accountInfoStyle}`}
										onClick={toggleEditEmail}
									>
										<div className="flex basis-32 items-center">
											<p className="text-xs leading-6 uppercase font-medium">
												Email
											</p>
										</div>
										<div className="flex basis-96">
											<p className="text-base">{user.email}</p>
										</div>
										<MailIcon className="h-7 w-7" />
									</div>
								</Tooltip>
							) : (
								<div className={`flex flex-col mb-6 py-4 px-6 ${formStyle}`}>
									<div className="flex items-center justify-between">
										<Tooltip arrow describeChild title="Click to go back">
											<button
												onClick={() => {
													resetEmailForm();
													toggleEditEmail();
												}}
											>
												<ArrowLeftIcon
													className={`h-9 w-9 rounded-full p-2 ${returnStyle}`}
												/>
											</button>
										</Tooltip>
										<MailOpenIcon className="h-6 w-6" />
									</div>
									<TextField
										name="email"
										value={formData.email}
										onChange={handleFormData}
										margin="normal"
										id="email"
										label="Email"
										type="text"
										fullWidth
										variant="outlined"
									/>
								</div>
							)}
						</div>

						<div>
							{!editPassword ? (
								<Tooltip
									arrow
									describeChild
									placement="right"
									title="Edit Password"
								>
									<div
										className={`flex gap-4 items-center px-4 py-[.81rem] w-full cursor-pointer
											${accountInfoStyle}`}
										onClick={toggleEditPassword}
									>
										<div className="flex basis-32 items-center">
											<p className="text-xs leading-6 uppercase font-medium">
												Password
											</p>
										</div>
										<div className="flex basis-96">
											<p className="text-base"></p>
										</div>
										<LockClosedIcon className="h-7 w-7" />
									</div>
								</Tooltip>
							) : (
								<div className={`flex flex-col py-4 px-6 ${formStyle}`}>
									<div className="flex items-center justify-between">
										<Tooltip arrow describeChild title="Click to go back">
											<button
												onClick={() => {
													resetPasswordForm();
													toggleEditPassword();
												}}
												className=""
											>
												<ArrowLeftIcon
													className={`h-9 w-9 rounded-full p-2 ${returnStyle}`}
												/>
											</button>
										</Tooltip>
										<LockOpenIcon className="h-6 w-6" />
									</div>
									<fieldset className="flex-col">
										<TextField
											name="currentPassword"
											value={formData.currentPassword}
											onChange={handleFormData}
											margin="normal"
											id="currentPassword"
											label="Verify Current Password"
											type={showPassword ? "text" : "password"}
											fullWidth
											variant="outlined"
											className="bg-transparent"
										/>
										<TextField
											name="newPassword"
											value={formData.newPassword}
											onChange={handleFormData}
											margin="normal"
											id="newPassword"
											label="New Password"
											type={showPassword ? "text" : "password"}
											fullWidth
											variant="outlined"
										/>
										<TextField
											name="confirmNewPassword"
											value={formData.confirmNewPassword}
											onChange={handleFormData}
											margin="normal"
											id="confirmNewPassword"
											label="Confirm New Password"
											type={showPassword ? "text" : "password"}
											fullWidth
											variant="outlined"
										/>
										<div className="pl-[.1rem] mt-1">
											<FormControlLabel
												control={<Checkbox onClick={toggleShowPasswords} />}
												label="Show password"
											/>
										</div>
									</fieldset>
								</div>
							)}
						</div>
					</div>
					{(editEmail || editPassword || editUsername) && (
						<div className="md:col-start-2 flex justify-end items-center mt-4 md:mt-5 gap-4">
							<button
								onClick={(e) => {
									handleSubmit(e);
								}}
								className={`${
									darkMode
										? "bg-sky-800 text-white hover:bg-sky-900 active:bg-sky-800"
										: "bg-sky-600 text-gray-100 hover:bg-sky-700 active:bg-sky-600"
								}  w-20 px-1 py-[.65rem] text-sm font-bold rounded-md`}
							>
								Save
							</button>
						</div>
					)}
				</div>
			</Dialog>
		</>
	);
}
