import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormQLMode } from '@formql/core';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs';


@Component({
    selector: 'app-formql',
    // template: `<formql [mode]="mode" [ids]="ids" [formName]="formName"></formql>`,
    template: `<app-formql-dynamic [data]="contactInfoData" [layout]="contacktInfoLayout" [loading]="contacktInfoLoading" (onSaveEvent)="saveContactInfo($event)"></app-formql-dynamic>`
})
export class AppFormQLComponent implements OnInit {

    title = 'app';
    mode: FormQLMode = FormQLMode.View;
    ids: Array<string>;
    formName: string;

    contacktInfoLayout: any;
    contactInfoData: any;
    contacktInfoLoading: any;

    constructor(
        private route: ActivatedRoute,
        private http: HttpClient
    ) {
        let routeSnap = this.route.snapshot;
        if (this.isEditMode(routeSnap))
            this.mode = FormQLMode.Edit;
        
        if (this.formName == null)
            this.formName = routeSnap.params["name"];

        if (routeSnap.params["id"]) {
            this.ids = [routeSnap.params["id"]];
        }   

            
    }

    ngOnInit(): void {
        zip(
            this.http.get('/assets/api/contactInfo.json'),
            this.http.get('/assets/api/contactInfo-data.json')
          ).subscribe(data => {
            this.contacktInfoLayout = data[0];
            this.contactInfoData = data[1];
            this.contacktInfoLoading = false;
          });
          
    }

    private isEditMode(routeSnap) {
        return (routeSnap.url.join("/").indexOf("/edit") != -1 || (routeSnap.parent != null && routeSnap.parent.url.join("/").indexOf("/edit") != -1));
    }

}
