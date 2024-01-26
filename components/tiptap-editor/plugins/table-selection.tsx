import { EditorState, Plugin, PluginKey } from '@tiptap/pm/state';

const tableSelectionKey = new PluginKey('table-selection');

export const TableSelectionPlugin = (
    updateIsInTable: (inTable: boolean) => void,
    updatePosition: () => void
) => {
    return new Plugin({
        key: tableSelectionKey,
        view() {
            return {
                update(view, prevState) {
                    const { state } = view;

                    const inTable = checkIfSelectionIsInTable(state);
                    updateIsInTable(inTable);
                    if (inTable) {
                        updatePosition(); // Update the position of the controls
                    } else {
                    }
                },
            };
        },
    });
};

function checkIfSelectionIsInTable(state: EditorState) {
    // console.log('state', state);
    let depth = state.selection.$anchor.depth;

    while (depth > 0) {
        let node = state.selection.$anchor.node(depth);
        if (node.type.name === 'table') {
            return true;
        }
        depth--;
    }

    return false;
}
