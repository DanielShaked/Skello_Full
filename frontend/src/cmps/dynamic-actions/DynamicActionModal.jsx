import { useRef, useEffect, useState } from "react"
// CMPS
import { MembersModalContent } from './MembersModalContent.jsx'
import { LabelsModalContent } from './LabelsModalContent.jsx'
import { CheckListModalContent } from './CheckListModalContent.jsx'
import { AttachmentModalContent } from "./AttachmentModalContent.jsx";
import { RemoveMenuPopup } from './RemoveMenuPopup.jsx';
import { EditAttachmentModalContent } from './EditAttachmentModalContent.jsx';
import { CoverModalContent } from './CoverModalContent.jsx'
import { DatesModalContent } from './DatesModalContent.jsx'
import { ProfileModalContent } from './ProfileModalContent.jsx'
import { SpeechToTextModalContent } from './SpeechToTextMoadlContent.jsx';
import { CreateBoardContent } from './CreateBoardContent.jsx';
import { CopyTaskModalContent } from './CopyTaskModalContent.jsx';


export function DynamicActionModal({ isMove, isDeleteModal = false ,toggleModal, type, task, isDetails = false, onRemoveGroup, groupId, group, board, event, posXAddition = 0, posYAddition = 0, onRemoveTodo, editTitle, attachmentTitle, todoId, isOnDetails = true }) {
    const wrapperRef = useRef(null)

    const [width, setWidth] = useState(window.innerWidth);
    // const [height, setHeight] = useState(window.innerHeight);
    const updateDimensions = () => {
        setWidth(window.innerWidth);
        // setHeight(window.innerHeight);
    }
    useEffect(() => {
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    const getContentForDisplay = () => {
        switch (type) {
            case 'members':
                return <MembersModalContent toggleModal={toggleModal} task={task} group={group} board={board} />
            case 'labels':
                return <LabelsModalContent toggleModal={toggleModal} task={task} group={group} board={board} />
            case 'checklist':
                return <CheckListModalContent toggleModal={toggleModal} task={task} group={group} board={board} />
            case 'attachment':
                return <AttachmentModalContent toggleModal={toggleModal} task={task} group={group} board={board} />
            case 'removeMenuPopup':
                return <RemoveMenuPopup toggleModal={toggleModal} onRemoveTodo={onRemoveTodo} groupId={groupId} onRemoveGroup={onRemoveGroup} todoId={todoId} />
            case 'editAttachment':
                return <EditAttachmentModalContent editTitle={editTitle} attachmentTitle={attachmentTitle} toggleModal={toggleModal} />
            case 'cover':
                return <CoverModalContent toggleModal={toggleModal} task={task} group={group} board={board} />
            case 'dates':
                return <DatesModalContent toggleModal={toggleModal} task={task} group={group} board={board} />
            case 'stt':
                return <SpeechToTextModalContent event={event} toggleModal={toggleModal} task={task} group={group} board={board} />
            case 'profile':
                return <ProfileModalContent toggleModal={toggleModal} posXAddition={posXAddition} type={type} />
            case 'createBoard':
                return <CreateBoardContent onToggleModal={toggleModal} posXAddition={posXAddition} posYAddition={posYAddition} task={task} group={group} board={board} type={type} />
            // case 'copy':
            //     return <CopyTaskModalContent onToggleModal={toggleModal} posXAddition={posXAddition} posYAddition={posYAddition} task={task} group={group} board={board} type={type} />
            case 'copy':
                return <CopyTaskModalContent isMove={isMove} toggleModal={toggleModal} posXAddition={posXAddition} posYAddition={posYAddition} task={task} group={group} board={board} type={type} />
            default: return
        }
    }
    const getModalPositionStyle = () => {
        if (width > 800) {
            const { top, left, height, right } = event.target.getBoundingClientRect();
            const startSide = (width / left < 2) ? 'right' : 'left'
            const startSideValue = (width / left < 2) ? 30 : left;
            if ((type === 'dates' || type === 'labels' || type === 'createBoard' || type === 'cover' || type === 'copy') && isDetails) {
                return { top: top / 2, left }
            }
            if (width > 1050) return { top: top + height, left: left }
            return { top: top + height, [startSide]: startSideValue + 'px' }
        } else {

            const { top, left, height, right } = event.target.getBoundingClientRect();
            const startSide = (width - left > 320) ? 'left' : 'right'
            const startSideValue = (width - left > 320) ? left : 20;

            if (width > 1050) return { top: top + height, [startSide]: startSideValue }
            if ((type === 'dates' || type === 'labels' || type === 'createBoard' || type === 'cover') && isDetails) {

                return { top: top / 2, right: 15 }
            }
            return { top: top + height, [startSide]: startSideValue + 'px' }
        }
    }



    if (!event) return <></>
    return (
        <section className={`dynamic-action-modal ${(isDeleteModal) ? 'delete-modal' : ''}`} style={getModalPositionStyle()} ref={wrapperRef} >
            {getContentForDisplay()}
        </section>
    )
}