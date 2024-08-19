import { Component, Input, forwardRef, HostListener, ElementRef, Output, EventEmitter, ViewChild } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

@Component({ selector: "search-dropdown", templateUrl: "search-dropdown.component.html", styleUrls: ["search-dropdown.component.scss"], providers: [ { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SearchDropdown), multi: true } ] })
export class SearchDropdown implements ControlValueAccessor {
    @Input("size") size: any;
    @Input("items") set items (value: any) {
        this.list = value;
        this.temp_list = value;
    }
    @Input("img") img: any;
    @Input("label") label: any;
    @Input("uid") uid: any;
    @Input("emptyText") emptyText: string = 'Nenhum resultado encontrado';
    @Input("selectText") selectText: any = undefined;
    @Output() afterChange = new EventEmitter();
    @ViewChild("input", { static: false }) input!: ElementRef;

    list = [];
    temp_list = [];
    keyword = "";
    _img: any;
    _label: any;
    _uid: any;

    onChange: any = () => { };
    onTouch: any = () => { };
    value: any = this.selectText ?? "Select";
    shown = false;

    constructor(private ele: ElementRef) {
    }

    ngOnChanges() {
        this._label = (typeof this.label !== 'undefined' && this.label !== '') ? this.label : 'name';
        this._img = (typeof this.img !== 'undefined' && this.img !== '') ? this.img : 'img';
        this._uid = (typeof this.uid !== 'undefined' && this.uid !== '') ? this.uid : 'id';
        this.value = this.selectText ?? "Select";
    }

    writeValue(value: any) {
        if (value) {
            this.temp_list.map(x => {
                if (x[this._uid] == value) {
                    this.value = x[this._label];
                }
            })
        }
    }

    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouch = fn;
    }
    
    search(e: any) {
        const val = e.toLowerCase();
        const temp = this.temp_list.filter((x: any) => {
            if (x[this._label].toLowerCase().indexOf(val) !== -1 || !val) {
                return x;
            }
        });
        this.list = temp;
    }

    select(item: any) {
        this.onChange(item[this._label]);
        this.value = item[this._label];
        this.shown = false;
        this.afterChange.emit(item);
    }

    show() {
        this.shown = this.shown ? false : true;
        setTimeout(() => {
            this.input.nativeElement.focus();
        }, 200);
    }

    @HostListener("document:click", ["$event"]) onClick(e: any) {
        if (!this.ele.nativeElement.contains(e.target)) {
            this.shown = false;
        }
    }
}
