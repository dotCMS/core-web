import {Inject} from 'angular2/angular2';
import {EntitySnapshot} from "../../persistence/EntityBase";
import {ApiRoot} from "../../../persistence/ApiRoot";
import {EntityMeta} from "../../../persistence/EntityBase";

export class RequestHeaderConditionletProvider {
    inputRef:EntityMeta
    comparisonRef:EntityMeta

    inputs: any
    comparisons: any

    promise:Promise<any>

    constructor(@Inject(ApiRoot) apiRoot) {
        this.inputs = {}
        this.comparisons = {}

        this.inputRef = apiRoot.conditionletsRef.child('/RequestHeaderConditionlet/comparisons/is/inputs')
        this.comparisonRef = apiRoot.conditionletsRef.child('/RequestHeaderConditionlet/comparisons')

        this.init();
    }

    init() {
        this.promise = new Promise((resolve, reject) => {

            this.comparisonRef.once('value', (snap:EntitySnapshot) => {
                this.comparisons = snap.val()[0]
            }, (e)=> {
                debugger
            })

            this.inputRef.once('value', (snap:EntitySnapshot) => {
                this.inputs = snap.val()[0][0].data
                resolve(this)
            }, (e)=> {
                debugger
            })

        });
    }
}