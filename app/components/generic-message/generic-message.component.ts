import {ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DynamicComponentDirective} from '../../directive/dynamic-component.directive';
import {DynamicHelperService} from '../../services/dynamic-helper.service';
import {Subscription} from 'rxjs';
import {DynamicComponent, DynamicComponentData} from '../../model/class/dynamic-component';
import * as _ from 'lodash';



@Component({
  selector: 'app-generic-message',
  templateUrl: './generic-message.component.html',
  styleUrls: ['./generic-message.component.css']
})
export class GenericMessageComponent implements OnInit, OnDestroy {

  @ViewChild(DynamicComponentDirective) dynamicComponent: DynamicComponentDirective;
  @ViewChild('modalRefHtml') modalRefHtml: ElementRef<HTMLDivElement>;

  // TIMER ANIMAZIONE
  timer: any = null;

  __subscription: Subscription;
  modalNative: HTMLDivElement;

  modalConfig: ModalConfig = {
    modal: {
      maxWidth: '50%'
    },
    modalHeader: {
      title: 'Informazioni'
    },
    modalBody: null,
    modalFooter: null,
    closeable: true
  };


  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private dynamicHelperService: DynamicHelperService,
              private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {

    this.__subscription = this.dynamicHelperService.component
      .subscribe((component: DynamicComponent) => {
        const viewContainerRef = this.dynamicComponent?.viewContainerRef;
        if (component != null) {
          if (component.getDynamicForm() != null) {
            if (viewContainerRef.length === 0) {
              const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component.getDynamicForm());
              viewContainerRef.clear();

              const componentRef = viewContainerRef.createComponent(componentFactory);
              this.modalNative = this.modalRefHtml.nativeElement;

              if (component.getData() != null) {
                const data = component.getData();
                type propType = typeof data.data;
                (<DynamicComponentData<propType>>componentRef.instance).data = component.getData();
              }

              if (component.getModalConfig() != null) {
                this.modalConfig = Object.assign({}, this.modalConfig, component.getModalConfig());
              }
            } else if (!_.isEqual(this.modalConfig, component.getModalConfig())) {
              this.modalConfig = Object.assign({}, this.modalConfig, component.getModalConfig());
            }

            clearTimeout(this.timer);

            if (this.modalNative.classList.contains('animate__fadeOutUp')) {
              this.modalNative.classList.remove('animate__fadeOutUp');
            }

            if (component.getShowModal()) {
              this.modalNative.style.display = 'block';
              this.modalNative.classList.add('animate__fadeInDown');
            } else {
              this.addEffectOut();
            }

          } else {
            this.addEffectOut();
          }
        } else {
          if (viewContainerRef != null && viewContainerRef.length > 0) {
            viewContainerRef.clear();
          }
        }
        this.cd.markForCheck();
      });
  }


  closeMondal() {
    this.dynamicHelperService.toggleModal();
  }

  addEffectOut(): void {
    if (this.modalNative != null && this.modalNative.classList.contains('animate__fadeInDown')) {

      this.modalNative.style.display = 'block';
      this.modalNative.classList.remove('animate__fadeInDown');
      this.modalNative.classList.add('animate__fadeOutUp');

      this.timer = setTimeout(() => {
        this.modalNative.classList.remove('animate__fadeOutUp');
        this.modalNative.style.display = 'none';
        this.dynamicHelperService.clear();
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    this.__subscription.unsubscribe();
  }

}

export interface ModalConfig {

  modal: { [p: string]: any } | null;
  modalHeader: {
    title?: string,
    style?: { [p: string]: any }
  } | null;
  modalBody: { [p: string]: any } | null;
  modalFooter: { [p: string]: any } | null;
  closeable?: boolean;

}
