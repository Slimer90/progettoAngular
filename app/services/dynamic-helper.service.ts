import {Injectable, Type} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ModalConfig} from '../components/generic-message/generic-message.component';
import {DynamicComponent} from '../model/class/dynamic-component';

@Injectable({
  providedIn: 'root'
})
export class DynamicHelperService {

  private _component: BehaviorSubject<DynamicComponent> = new BehaviorSubject<DynamicComponent>(null);

  addDataComponent(data: { [k: string]: any }) {
    this._component.next(this.component.value.setData(data));
  }


  get component(): BehaviorSubject<DynamicComponent> {
    return this._component;
  }

  toggleModal(): void {
    this.component.next(this.component.value.setShowModal(!this.component.value.getShowModal()));
  }

  toggleClosable(): void {
    this.component.next(this.component.value.toogleClosable());
  }

  getShowModal(): boolean {
    return this.component.value.getShowModal();
  }

  clear(): void {
    this.component.next(null);
  }

  selectComponent(component: Type<any>, data?: { [k: string]: any }, style?: ModalConfig) {
    let f;

    if (data != null) {
      if (style != null) {
        f = new DynamicComponent(component, data, style);
      } else {
        f = new DynamicComponent(component, data);
      }
    } else {
      if (style != null) {
        f = new DynamicComponent(component, null, style);
      } else {
        f = new DynamicComponent(component);
      }
    }

    f.setShowModal(true);
    this.component.next(f);
  }


}
