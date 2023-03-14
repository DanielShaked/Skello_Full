import axios from 'axios';
import { utilService } from '../services/util.service.js';
import { httpService } from './http.service.js';
import { socketService } from './socket.service.js';
import { userService } from './user.service.js';

const API_KEY_UNSPLASH = 'Nw9aD2jV-Yfb_bfoA37BqoleA2un9Nv68GDKeRed8Jk';

export const boardService = {
    query,
    getById,
    addGroup,
    removeGroup,
    queryImages,
    addTask,
    updateTask,
    addChecklist,
    addTodo,
    addFile,
    update,
    updateWithoutSocket,
    add,
};

async function query() {
    const boards = await httpService.get('board');
    return boards;
}

// Img
async function queryImages(query) {
    if (!query) query = 'random';
    const photos = await axios.get(
        `https://api.unsplash.com/search/photos/?query=${query}&client_id=${API_KEY_UNSPLASH}`
    );
    return photos.data.results;
}

async function getById(boardId) {
    try {
        const board = await httpService.get(`board/${boardId}`);
        return board;
    } catch (err) {
        console.log('Cannot get board by id', err);
    }
}

async function updateWithoutSocket(board) {
    try {
        await httpService.put('board', board);
        return board;
    } catch (err) {
        console.log('Cannot update board', err);
    }
}


async function update(board) {
    try {
        await httpService.put('board', board);
        socketService.emit('board-change', board);
        return board;
    } catch (err) {
        console.log('Cannot update board', err);
    }
}

async function add(title, style) {
    const loggedUser = userService.getLoggedinUser();
    const board = {
        isStarred: false,
        title,
        isPublic: false,
        createdAt: Date.now(),
        createdBy: loggedUser,
        style,
        archive: [],
        labels: [
            // green
            {
                id: 'l101',
                title: '',
                color: '#61bd4f',
            },
            // yellow
            {
                id: 'l102',
                title: '',
                color: '#f2d600',
            },
            // orange
            {
                id: 'l103',
                title: '',
                color: '#ff9f1a',
            },
            // red
            {
                id: 'l104',
                title: '',
                color: '#eb5a46',
            },
            // purple
            {
                id: 'l105',
                title: '',
                color: '#c377e0',
            },
            // blue
            {
                id: 'l106',
                title: '',
                color: '#0079bf',
            },
        ],
        members: [{ ...loggedUser }],
        groups: [],
        activities: [],
    };
    try {
        const savedBoard = await httpService.post('board', board);
        return savedBoard;
    } catch (err) {
        console.log('Cannot save board', err);
    }
}

// async function save(newBoard) {
//   // Edit
//   if (newBoard._id) {
//     // update our gBoards that with the new board
//     const oldBoard = gBoards.find(board => board._id === newBoard._id);
//     const oldBoardIdx = gBoards.findIndex(board => board._id === oldBoard._id);
//     gBoards.splice(oldBoardIdx, 1, newBoard);

//     return storageService.put(STORAGE_KEY, newBoard);
//   } else {
//     // Add
//     return storageService.post(STORAGE_KEY, newBoard);
//   }
// }

// set localstorage with dummy data
// function _setBoardsToStorage() {
//   let boards = storageService.loadFromStorage(STORAGE_KEY);
//   if (!boards || !boards.length) {
//     boards = DUMMY_BOARDS;
//   }
//   _saveBoardsToStorage(boards);
//   return boards;
// }

// // Localstorage func
// function _saveBoardsToStorage(boards) {
//   storageService.saveToStorage(STORAGE_KEY, boards);
// }

async function removeGroup(groupId, boardId) {
    try {
        const board = await getById(boardId);
        board.groups = board.groups.filter(group => group.id !== groupId);
        board.activities = board.activities.filter(activity => activity.group.id !== groupId)
        update(board);
        return board;
    } catch (err) {
        console.log('Cant remove group', err);
    }
}

// function removeGroup(groupId, boardId) {
//   const boardIdx = gBoards.findIndex(board => board._id === boardId);
//   const board = gBoards[boardIdx];
//   const groupIdx = board.groups.findIndex(group => group.id === groupId);
//   board.groups.splice(groupIdx, 1);

//   return storageService.put(STORAGE_KEY, board);
// }

async function addGroup(title, boardId) {
    const newGroup = {
        id: utilService.makeId(),
        title,
        tasks: [],
    };
    try {
        const board = await getById(boardId);
        board.groups.push(newGroup);

        update(board);
        return board;
    } catch (err) {
        console.log('Cannot add group', err);
    }
}

// function addGroup(groupTitle, boardId) {
//   const newGroup = {
//     id: utilService.makeId(),
//     title: groupTitle,
//     tasks: [],
//   };

//   const board = gBoards.find(board => board._id === boardId);
//   board.groups.push(newGroup);
//   return storageService.put(STORAGE_KEY, board);
// }

async function addTask(title, groupId, boardId) {
    const taskToAdd = {
        id: utilService.makeId(),
        createdAt: Date.now(),
        title,
        style: {
            backgroundColor: null,
            backgroundImage: {
                title: null,
                url: null,
            },
        },
        description: '',
        dueDate: null,
        isDone: false,
        archiveAt: null,
        byMember: userService.getLoggedinUser(),
        checklists: [],
        labelIds: [],
        members: [],
        attachments: [],
        comments: [],
    };

    try {
        const board = await getById(boardId);
        const groupIdx = board.groups.findIndex(group => group.id === groupId);
        board.groups[groupIdx].tasks.push(taskToAdd);

        update(board);
        return board;
    } catch (err) {
        console.log('Cannot add task', err);
    }
}

// function addTask(taskTitle, groupId, boardId) {
//   const taskToAdd = {
//     id: utilService.makeId(),
//     createdAt: Date.now(),
//     title: taskTitle,
//     style: {
//       backgroundColor: null,
//       backgroundImage: {
//         title: null,
//         url: null,
//       },
//     },
//     description: '',
//     dueDate: null,
//     isDone: false,
//     archiveAt: null,
//     byMember: {
//       _id: 'u101',
//       imgUrl: 'url',
//       fullname: 'Muki Pori',
//       username: 'muki2',
//     },
//     checklists: [],
//     labelIds: [],
//     members: [],
//     attachments: [],
//     comments: [],
//   };

//   const board = gBoards.find(board => board._id === boardId);
//   const groupIdx = board.groups.findIndex(group => group.id === groupId);
//   board.groups[groupIdx].tasks.push(taskToAdd);

//   return storageService.put(STORAGE_KEY, board);
// }

async function addChecklist(title, groupId, boardId, taskId) {
    const checklistToAdd = {
        id: utilService.makeId(),
        title,
        todos: [],
    };
    try {
        const board = await getById(boardId);
        const groupIdx = board.groups.findIndex(group => group.id === groupId);
        const taskIdx = board.groups[groupIdx].tasks.findIndex(task => task.id === taskId);
        board.groups[groupIdx].tasks[taskIdx].checklists.push(checklistToAdd);

        update(board);
        return board;
    } catch (err) {
        console.log('Cannot add checklist', err);
    }
}

// function addChecklist(title, groupId, board, taskId) {
//   const checklistToAdd = {
//     id: utilService.makeId(),
//     title,
//     todos: [],
//   };
//   const groupIdx = board.groups.findIndex(group => group.id === groupId);
//   const taskIdx = board.groups[groupIdx].tasks.findIndex(task => task.id === taskId);
//   board.groups[groupIdx].tasks[taskIdx].checklists.push(checklistToAdd);
//   return storageService.put(STORAGE_KEY, board);
// }

async function addTodo(boardId, groupId, taskId, checklistId, title) {
    const todoToAdd = {
        id: utilService.makeId(),
        title,
        isDone: false,
    };

    try {
        const board = await getById(boardId);
        const groupIdx = board.groups.findIndex(group => group.id === groupId);
        const taskIdx = board.groups[groupIdx].tasks.findIndex(task => task.id === taskId);
        const checklistIdx = board.groups[groupIdx].tasks[taskIdx].checklists.findIndex(
            checklist => checklist.id === checklistId
        );
        board.groups[groupIdx].tasks[taskIdx].checklists[checklistIdx].todos.push(todoToAdd);

        update(board);
        return board;
    } catch (err) {
        console.log('Cannot add todo', err);
    }
}

// function addTodo(board, groupId, taskId, checklistId, title) {
//   const todoToAdd = {
//     id: utilService.makeId(),
//     title,
//     isDone: false,
//   };
//   const groupIdx = board.groups.findIndex(group => group.id === groupId);
//   const taskIdx = board.groups[groupIdx].tasks.findIndex(task => task.id === taskId);
//   const checklistIdx = board.groups[groupIdx].tasks[taskIdx].checklists.findIndex(
//     checklist => checklist.id === checklistId
//   );
//   board.groups[groupIdx].tasks[taskIdx].checklists[checklistIdx].todos.push(todoToAdd);
//   return storageService.put(STORAGE_KEY, board);
// }

async function addFile(boardId, groupId, taskId, fileUrl) {
    const attachmentToAdd = {
        id: utilService.makeId(),
        createdAt: Date.now(),
        name: 'Media url',
        url: fileUrl,
    };

    try {
        const board = await getById(boardId);
        const groupIdx = board.groups.findIndex(group => group.id === groupId);
        const taskIdx = board.groups[groupIdx].tasks.findIndex(task => task.id === taskId);
        board.groups[groupIdx].tasks[taskIdx].attachments.push(attachmentToAdd);

        update(board);
        return board;
    } catch (err) {
        console.log('Cannot add file', err);
    }
}

// function addFile(board, groupId, taskId, fileUrl) {
//   const attachmentToAdd = {
//     id: utilService.makeId(),
//     createdAt: Date.now(),
//     name: 'Media url',
//     url: fileUrl,
//   };
//   const groupIdx = board.groups.findIndex(group => group.id === groupId);
//   const taskIdx = board.groups[groupIdx].tasks.findIndex(task => task.id === taskId);
//   board.groups[groupIdx].tasks[taskIdx].attachments.push(attachmentToAdd);
//   return storageService.put(STORAGE_KEY, board);
// }

// Finds the same task, and replace it - We need to send here the taskToUpdate!!!
async function updateTask(boardId, groupId, taskId, taskToUpdate, activityTxt = null, isComment) {
    try {
        const board = await getById(boardId);
        const groupIdx = board.groups.findIndex(group => group.id === groupId);
        const taskIdx = board.groups[groupIdx].tasks.findIndex(task => task.id === taskId);
        board.groups[groupIdx].tasks.splice(taskIdx, 1, taskToUpdate);
        if (activityTxt) {
            const formattedActivity = _getFormattedActivity(taskToUpdate, board.groups[groupIdx], activityTxt, isComment);
            board.activities.unshift(formattedActivity);
        }

        update(board);
        return board;
    } catch (err) {
        console.log('Cannot update task', err);
    }
}

// Finds the same task, and replace it - We need to send here the taskToUpdate!!!
// function updateTask(boardId, groupId, taskId, taskToUpdate, activityTxt = null) {
//   const board = gBoards.find(board => board._id === boardId);
//   const groupIdx = board.groups.findIndex(group => group.id === groupId);
//   const taskIdx = board.groups[groupIdx].tasks.findIndex(task => task.id === taskId);
//   board.groups[groupIdx].tasks.splice(taskIdx, 1, taskToUpdate);
//   if (activityTxt) {
//     const formattedActivity = _getFormattedActivity(taskToUpdate, activityTxt)
//     board.activities.unshift(formattedActivity);
//   }
//   return storageService.put(STORAGE_KEY, board);
// }

function _getFormattedActivity(task, group, txt, isComment) {
    const activity = {
        id: utilService.makeId(),
        txt,
        task,
        group: {
            id: group.id,
            title: group.title
        },
        isComment,
        createdAt: Date.now(),
        member: userService.getLoggedinUser(),
    };
    return activity
}

//  : CHECK OPTION TO USE IT
// export function updateTaskTest(board, updatedTask) {
//   console.log(board);
//   board.groups.forEach(group => {
//     group.tasks.forEach((task, idx) => {
//       if (task.id === updatedTask.id) group.tasks[idx] = updatedTask;
//     });
//   });
//   return {...board};
// }