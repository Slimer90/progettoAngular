import {Type} from '@angular/core';
import {ModalConfig} from '../../components/generic-message/generic-message.component';


type ModalType = keyof ModalConfig;

export class DynamicComponent {

  private component: Type<any>;
  private data?: { [p: string]: any };
  private showModal = false;
  private modalConfig?: ModalConfig;

  constructor(component: Type<any>, data?: { [p: string]: any }, modalConfig?: ModalConfig) {
    this.component = component;
    this.data = data;
    this.modalConfig = modalConfig;
  }

  setData(data: { [p: string]: any }): DynamicComponent {
    this.data = data;
    return this;
  }

  getData(): { [p: string]: any } {
    return this.data;
  }

  setModalConfig(style: ModalConfig): DynamicComponent {
    this.modalConfig = style;
    return this;
  }

  toogleClosable(): DynamicComponent {
    this.modalConfig.closeable = !this.modalConfig.closeable;
    return this;
  }

  updateSectionModalConfig(sectionUpdate: ModalType, style: any): void {
    this.modalConfig[sectionUpdate] = Object.assign({}, this.modalConfig[sectionUpdate], style);
  }

  getModalConfig(): ModalConfig {
    return this.modalConfig;
  }

  updateData(updateData: { [p: string]: any }): DynamicComponent {
    if (this.data == null) {
      this.data = updateData;
    } else {
      this.data = Object.assign(this.data, updateData);
    }
    return this;
  }

  getDynamicForm(): Type<any> {
    return this.component;
  }

  getShowModal(): boolean {
    return this.showModal;
  }

  setShowModal(value: boolean): DynamicComponent {
    this.showModal = value;
    return this;
  }
}

export interface DynamicComponentData<T> {
  data: T;
}

