import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { GrClose } from 'react-icons/gr';
import { Loader } from '../cmps/Loader.jsx';

// CPMS
import { TaskCover } from '../cmps/task-details/TaskCover.jsx';
import { TaskHeader } from '../cmps/task-details/TaskHeader.jsx';
import { TaskAdditionsShow } from '../cmps/task-details/TaskAdditionsShow.jsx';
import { TaskDescription } from '../cmps/task-details/TaskDescription.jsx';
import { TaskChecklists } from '../cmps/task-details/TaskChecklists.jsx';
import { TaskAttachments } from '../cmps/task-details/TaskAttachments.jsx';
import { TaskActivities } from '../cmps/task-details/TaskActivities.jsx';
import { TaskSideBar } from '../cmps/task-details/TaskSideBar.jsx';
import { TaskArchiveHeader } from '../cmps/task-details/TaskArchiveHeader.jsx';


export function TaskDetails(props) {
  const [group, setGroup] = useState(null);
  const [task, setTask] = useState(null);
  const board = useSelector(state => state.boardModule.board);

  useEffect(() => {
    const { boardId, groupId, taskId } = props.match.params;
    const currGroup = board?.groups.find(group => group.id === groupId);
    setGroup(currGroup);
    const currTask = currGroup?.tasks?.find(task => task.id === taskId);
    setTask(currTask);
  }, [board]);

  const onCloseModal = () => {
    props.history.push(`/board/${board._id}`);
  };

  const onSaveTaskChecklists = checklists => {
    task.checklists = checklists;
    this.setTask(task);
  };

  if (!task) return <Loader />;
  return (
    <section
      className="task-details-page"
      onClick={() => {
        onCloseModal();
      }}>
      <div
        className="task-details-modal"
        onClick={ev => {
          ev.stopPropagation();
        }}>
        <button
          className="close-modal-btn"
          onClick={() => {
            onCloseModal();
          }}>
          <GrClose style={{ height: '15px', width: '15px' }} />
        </button>
        
        {/* Cover */}
        <TaskCover board={board} group={group} task={task} />
        
        {/* archive-header */}
        {task.archiveAt && <TaskArchiveHeader />}
        
        {/* Details-header */}
        <TaskHeader board={board} group={group} task={task} title={task.title} />

        <section className="main-content">
          {/* Main-Col */}
          <section className="main-col">
            {/* Potential members, labels and dueDate */}
            <TaskAdditionsShow board={board} group={group} task={task} />

            {/* Description */}
            <TaskDescription board={board} group={group} task={task} description={task.description} />
            
            {/* Attachments */}
            {task.attachments?.length > 0 && <TaskAttachments board={board} group={group} task={task} />}
            
            {/* CheckList */}
            <TaskChecklists
              boardId={props.match.params.boardId}
              groupId={props.match.params.groupId}
              task={task}
              board={board}
              onSaveTaskChecklists={onSaveTaskChecklists}
            />
            {/* {task.checklists?.length && <TaskChecklist />} */}

            {/* Activities */}
            <TaskActivities board={board} group={group} task={task} />
          </section>

          {/* Side-Bar */}
          <TaskSideBar task={task} group={group} board={board} />
        </section>
      </div>
    </section>
  );
}
