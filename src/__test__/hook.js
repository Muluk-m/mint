let isMount = true;
let workInProgressHook = null;

const fiber = {
  stateNode: App,
  memoizedState: null
};

function useState(initialState) {
  let hook;

  if (isMount) {
    hook = {
      memoizedState: initialState,
      next: null,
      // pending === null 表示当前hook 还没有要触发的更新
      queue: {
        pending: null
      }
    };

    if (!fiber.memoizedState) {
      fiber.memoizedState = hook;
    } else {
      workInProgressHook.next = hook;
    }
    workInProgressHook = hook;
  } else {
    hook = workInProgressHook;
    workInProgressHook = workInProgressHook.next;
  }

  // 初始状态为 hook.memoizedState
  let baseState = hook.memoizedState;

  // 如果hook的pending存在 表示本次更新有新的update
  if (hook.queue.pending) {
    // 找到第一个update
    let firstUpdate = hook.queue.pending.next;

    // 遍历这条链表
    do {
      // 取出对应的action
      const { action } = firstUpdate;
      // 基于action计算一个新的state
      baseState = typeof action === 'function' ? action(baseState) : action;
      firstUpdate = firstUpdate.next;
    } while (firstUpdate !== hook.queue.pending.next);

    hook.queue.pending = null;
  }

  hook.memoizedState = baseState;
  return [baseState, dispatchAction.bind(null, hook.queue)];
}

function dispatchAction(queue, action) {
  const update = {
    action,
    next: null
  };

  if (queue.pending === null) {
    // uo -> uo -> uo
    update.next = update;
  } else {
    // u1 -> u0 -> u1
    update.next = queue.pending.next;
    queue.pending.next = update;
  }
  queue.pending = update;

  schedule();
}

function schedule() {
  workInProgressHook = fiber.memoizedState;
  const app = fiber.stateNode();
  isMount = false;
  return app;
}

function App() {
  const [num, updateNum] = useState(0);
  const [num1, updateNum1] = useState(10);
  const [num2, updateNum2] = useState(100);

  console.log('isMount:', isMount);
  console.log('num:', num);
  console.log('num1:', num1);

  return {
    onClick() {
      updateNum((num) => num + 1);
    },
    onFocus() {
      updateNum1((num) => num + 10);
    },
    onChange() {
      updateNum2((num) => num + 100);
    }
  };
}

window.app = schedule();
