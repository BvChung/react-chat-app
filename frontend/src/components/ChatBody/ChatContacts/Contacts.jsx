import { useState, useEffect, useCallback } from "react";
import { PlusIcon, PencilAltIcon } from "@heroicons/react/outline";
import { GlobeIcon } from "@heroicons/react/solid";
import { SearchIcon } from "@heroicons/react/solid";
import ContactItem from "./ContactItem";
import ContactMenu from "./ContactMenu";
import { useSelector, useDispatch } from "react-redux";
import { getChatConversations } from "../../../features/Conversations/conversationSlice";
import { updateChatGroup } from "../../../features/Messages/messageSlice";

function Contacts() {
	const dispatch = useDispatch();
	const { groups } = useSelector((state) => state?.conversations);
	// console.log(groups);
	const { userConversations } = useSelector(
		(state) => state?.conversations?.groups
	);
	// console.count(userConversations);

	const loadConversations = useCallback(() => {
		dispatch(getChatConversations());
	}, [dispatch]);

	useEffect(() => {
		loadConversations();
	}, [loadConversations]);

	const [active, setActive] = useState(false);
	function toggleActive() {
		setActive((prevActive) => !prevActive);
	}

	const [open, setOpen] = useState(false);
	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};

	const [input, setInput] = useState({
		text: "",
	});

	function handleChange(e) {
		const { name, value } = e.target;

		setInput((prevInput) => {
			return {
				...prevInput,
				[name]: value,
			};
		});
	}

	const [groupActive, setGroupActive] = useState({ activeIndex: -1 });
	function toggleGroupActive(i) {
		setGroupActive({
			activeIndex: i,
		});
	}

	const { messageGroup } = useSelector((state) => state?.messages);
	const globalActive =
		groupActive.activeIndex === -1
			? "bg-gray6 dark:bg-slate-800 border-l-sky-600 border-l-2 dark:border-l-sky-600"
			: "border-l-2 border-l-gray4 dark:border-l-gray-500";
	// const globalActive =
	// 	messageGroup === "Global"
	// 		? "bg-slate-200 dark:bg-slate-800 border-l-sky-600 border-l-2 dark:border-l-sky-500"
	// 		: "border-l-2 border-l-sky-900";

	// console.count("render");

	return (
		<div className="hidden md:flex flex-col w-[40%] max-w-[350px] bg-offwhite dark:bg-dark2">
			<div className="flex items-center justify-between mb-4 px-6 py-4 pb-4 h-16 border-b-2 dark:border-b-dark4 shadow-sm">
				<p className="text-gray1 text-2xl font-bold dark:text-white">
					Messages
				</p>
				<button>
					<PencilAltIcon className="h-8 w-8 text-sky-500" />
				</button>
			</div>

			<div className="mx-[10px] h-95% py-4 px-2 dark:bg-dark3 rounded-md">
				<div
					className="flex items-center justify-center gap-2 mb-6 h-14 bg-sky-500 rounded-3xl shadow-md
				active:shadow-lg hover:bg-sky-600 cursor-pointer transition-all
				dark:bg-sky-700 dark:hover:bg-sky-600"
					onClick={() => {
						handleClickOpen();
					}}
				>
					<PlusIcon className="w-6 h-6 text-white" />
					<span className="font-medium text-white">Create Group</span>
				</div>

				<ContactMenu open={open} handleClose={handleClose} />

				<div
					className="flex-grow h-full max-h-[715px] bg-transparent py-1 overflow-y-auto pr-4
				rounded-lg "
				>
					<div
						onClick={() => {
							toggleGroupActive(-1);
							dispatch(updateChatGroup("Global"));
						}}
						className={`flex items-center w-full h-12 pl-4 gap-2 
							hover:bg-slate-200 dark:hover:bg-slate-800 ${globalActive}`}
					>
						<GlobeIcon className="h-7 w-7 text-sky-500 dark:text-sky-600" />
						<span className="dark:text-white">Global</span>
					</div>
					{userConversations?.map((group, i) => {
						return (
							<ContactItem
								key={group._id}
								groupId={group._id}
								groupName={group.groupName}
								indexNumber={i}
								groupActive={groupActive}
								toggleGroupActive={toggleGroupActive}
							/>
						);
					})}
				</div>
			</div>
			{/* <div
				className="flex items-center border-[2px] border-transparent mb-10
            bg-white focus-within:border-sky-600 w-full p-2 rounded-3xl shadow-md"
			>
				<input
					name="text"
					value={input.text}
					type="text"
					placeholder="Find message"
					onChange={handleChange}
					className="outline-none bg-transparent w-11/12 px-2 placeholder:text-gray-500"
				></input>
				<SearchIcon className="w-5 h-5 text-gray1" />
			</div> */}
		</div>
	);
}

export default Contacts;

const ex = [
	{ _id: "6233a3e6f4cef1bba5c015c4", username: "GuestAccount" },
	{ _id: "623441a4573f4a2aa70371f2", username: "brandon" },
	{ _id: "62466d6c627e80838c408f56", username: "1" },
];

const filter = ex.filter((ex) => {
	return ex._id !== "6233a3e6f4cef1bba5c015c4";
});

console.log(filter);
