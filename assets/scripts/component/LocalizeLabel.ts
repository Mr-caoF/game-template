import { ENotifyType } from "../Enum";
import Game from "../Game";

const {ccclass, property, executeInEditMode, menu, inspector} = cc._decorator;

@ccclass
@executeInEditMode()
@menu("i18n:MAIN_MENU.component.renderers/LocalizeLabel")
@inspector("packages://game-helper/inspectors/localizelabel.js")
export default class LocalizeLabel extends cc.Label {
    @property()
    private _tid = "";
    @property({
        multiline: true,
        tooltip: "多语言 text id",
    })
    set tid(value: string) {
        this._tid = value;
        this.updateString();
    }
    get tid() {
        return this._tid;
    }

    protected onLoad() {
        super.onLoad();
        Game.NotifyUtil.on(ENotifyType.LANGUAGE_CHANGED, this.onLanguageChanged, this);
        this._tid && this.updateString();
    }

    protected onDestroy() {
        super.onDestroy();
        Game.NotifyUtil.off(ENotifyType.LANGUAGE_CHANGED, this.onLanguageChanged, this);
    }

    private onLanguageChanged() {
        this.updateString();
    }

    private updateString() {
        if (CC_EDITOR) {
            Editor.Ipc.sendToMain("game-helper:getLangStr", this._tid, (e: Error, str: string) => {
                if (e) {
                    return;
                }
                this.string = str;
            });
        } else {
            this.string = Game.LocalizeUtil.getLangStr(this._tid);
        }
    }
}