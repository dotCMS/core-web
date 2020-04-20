import { DotKeyValue } from '@shared/models/dot-key-value/dot-key-value.model';

export class DotKeyValueUtil {
    /**
     * Checks if Save button should be disabled
     * @param {boolean} isKeyVariableDuplicated
     * @param {DotKeyValue} variable
     * @returns boolean
     * @memberof DotKeyValueUtil
     */
    static isSaveDisabled(isKeyVariableDuplicated: boolean, variable: DotKeyValue): boolean {
        return this.isFieldDisabled(variable) || isKeyVariableDuplicated;
    }

    /**
     * Checks based on field values if the whole field should be disable
     * @param {DotKeyValue} variable
     * @returns boolean
     * @memberof DotKeyValueUtil
     */
    static isFieldDisabled(variable: DotKeyValue): boolean {
        return variable.key === '' || variable.value === '';
    }

    /**
     * Checks if growl message should be displayed
     * @param {boolean} isKeyVariableDuplicated
     * @param {Event} event
     * @returns boolean
     * @memberof DotKeyValueUtil
     */
    static shouldDisplayDuplicatedVariableError(
        isKeyVariableDuplicated: boolean,
        $event: Event
    ): boolean {
        return isKeyVariableDuplicated && $event && $event.type === 'blur';
    }

    /**
     * Checks if a variable is duplicated on a list of variables
     * @param {DotKeyValue} variable
     * @param {DotKeyValue[]} variablesList
     * @param {boolean} [newVariable]
     * @returns boolean
     * @memberof DotKeyValueUtil
     */
    static isFieldVariableKeyDuplicated(
        variable: DotKeyValue,
        variablesList: DotKeyValue[],
        newVariable?: boolean
    ): boolean {
        const limitAllowed = newVariable ? 0 : 1;
        return (
            variablesList.filter((item: DotKeyValue) => item.key === variable.key).length >
            limitAllowed
        );
    }

    /**
     * Checks if the Key input field should be Invalid
     * @param {KeyboardEvent} event
     * @param {DotKeyValue} variable
     * @returns boolean
     * @memberof DotKeyValueUtil
     */
    static keyInputInvalid(event: KeyboardEvent, variable: DotKeyValue): boolean {
        return variable.key === '' && this.isKeyInput(event);
    }

    /**
     * Checks if based on the Event passed the Key Input field exist
     * @param {KeyboardEvent} event
     * @returns boolean
     * @memberof DotKeyValueUtil
     */
    static isKeyInput(event: KeyboardEvent): boolean {
        const element = <HTMLElement>event.srcElement;
        return element.classList.contains('field-key-input');
    }

    /**
     * Checks if a variable exist on a list, if exists returns the index
     * otherwise returns null
     * @param {DotKeyValue} variable
     * @param {DotKeyValue[]} variablesList
     * @returns number | null
     * @memberof DotKeyValueUtil
     */
    static getVariableIndexChanged(variable: DotKeyValue, variableList: DotKeyValue[]): number {
        let index = null;
        for (let i = 0, total = variableList.length; total > i; i++) {
            if (variableList[i].key === variable.key) {
                index = i;
                break;
            }
        }
        return index;
    }
}
