// app: Sports
// class: orderdetail
// purpose: download and show order detail
// author: mauricio dos santos
// date: january 16 2019

import { app } from '../common/app';
import { net } from '../common/net';
import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { ActivatedRoute } from '@angular/router';
import { ListView } from 'tns-core-modules/ui/list-view';
import { Page, View } from 'tns-core-modules/ui/page';
import * as dialog from 'tns-core-modules/ui/dialogs';

@Component({
    selector: 'ns-orderdetail',
    moduleId: module.id,
    templateUrl: './orderdetail.component.html',
})

export class OrderDetailComponent implements OnInit {

    private title: String;
    private backIcon: String = String.fromCharCode(0xea40);
    private plusIcon: String = String.fromCharCode(0xea0a) + 'L';
    private leftIcon: View;
    private rightIcon: View;
    private _id: String;
    private RepName: String;
    private CustNum: String;
    private Ordernum: String;
    private Name: String;
    private ttOrderLine = {};
    private ttOrderDetail = {};
    private ttCustomer = {};
    private selectedTab: Number = 0;
    private customerData = [];
    private orderData = [];
    private orderDataList: ListView;
    private customerDataList: ListView;

    public constructor (private app: app, private net: net, private page: Page, private router: RouterExtensions, private screen: ActivatedRoute) {}

    ngOnInit(): void {
        console.log('orderdetail ngOnInit');
        this.app.loading = true;
        this.title = 'Loading order detail...';
        this._id = this.screen.snapshot.params['_id'];
        this.RepName = this.screen.snapshot.params['RepName'];
        this.CustNum = this.screen.snapshot.params['CustNum'];
        this.Name = this.screen.snapshot.params['Name'];
        this.Ordernum = this.screen.snapshot.params['Ordernum'];
        this.leftIcon = <View>this.page.getViewById('leftIcon');
        this.rightIcon = <View>this.page.getViewById('rightIcon');
        this.orderDataList = <ListView>this.page.getViewById('orderDataList');
        this.customerDataList = <ListView>this.page.getViewById('customerDataList');
        setTimeout(() => this.getOrderDetail(),50);
    }

    private getOrderDetail () {
        console.log('orderdetail getOrderDetail',this.Ordernum);
        this.net.getOrderDetail({
            Ordernum: this.Ordernum,
            onSuccess: (dsOrderDetail) => this.showOrderDetail(dsOrderDetail),
            onError: () => {
                this.app.loading = false;
                dialog.confirm({
                    title: 'Could Not Download Order Detail',
                    message: 'Ensure your have a strong network signal and try again.',
                    okButtonText: 'OK'
                }).then(()=>this.showOrders());
            }
        })
    }

    private showOrderDetail (dsOrderDetail) {
        console.log('orderdetail showOrderDetail',dsOrderDetail);
        if (dsOrderDetail.ttOrderLine)
            this.ttOrderLine = dsOrderDetail.ttOrderLine;
        else
            this.ttOrderLine = [];
        this.title = 'Order# ' + this.Ordernum;
        this.ttOrderDetail = dsOrderDetail.ttOrderDetail[0];
        this.ttOrderDetail['_id'] = this._id;
        this.ttCustomer = dsOrderDetail.ttCustomer[0];
        this.ttCustomer['_id'] = this._id;
        for (let k in this.ttOrderDetail) 
            if (k.indexOf('Ordernum') === -1 && k.indexOf('CustNum') === -1 && k.indexOf('_id') === -1)
                this.orderData.push({columnLabel: k, columnValue: this.ttOrderDetail[k]});
        for (let k in this.ttCustomer)
            if (k.indexOf('CustNum') === -1 && k.indexOf('SalesRep') === -1)
                this.customerData.push({columnLabel: k, columnValue: this.ttCustomer[k]});
        // trick: add some keyboard buffer area
        for (let i=0; i<6; i++) {
            this.orderData.push({});
            this.customerData.push({});
        }
        this.app.loading = false;
    }

    private showItem (e) {
        console.log('orderdetail showItem',e.index);
        this.router.navigate(['/item',this._id,this.RepName,this.CustNum,this.Name,this.Ordernum,this.ttOrderLine[e.index].Itemnum],{clearHistory:true,transition:{name:'fade'}});
    }

    private showOrders () {
        console.log('orderdetail showOrder');
        this.app.animateIcon({
            target: this.leftIcon,
            onSuccess: () => {
                this.router.navigate(['/orders',this.RepName,this.CustNum,this.Name],{clearHistory:true,transition:{name:'fade'}});
            }
        });
    }

    private editOrder (e) {
        console.log('orderdetail editOrder',e.index);
        console.log(this.orderData[e.index]);
        console.log(this.ttOrderDetail[this.orderData[e.index].columnLabel]);
        this.orderDataList.scrollToIndexAnimated(e.index);
    }

    private updateOrder (index,newValue) {
        console.log('orderdetail updateOrder',index,newValue);
        console.log(this.orderData[index]);
        console.log(this.ttOrderDetail[this.orderData[index].columnLabel]);
        if (this.ttOrderDetail[this.orderData[index].columnLabel] !== newValue) {
            this.ttOrderDetail[this.orderData[index].columnLabel] = newValue;
            this.net.updateOrder({
                ttOrder: this.ttOrderDetail,
                onSuccess: () => {console.log('orderdetail updateOrder SUCCESS')},
                onError: () => {
                    console.log('orderdetail updateOrder ERROR?');
                    /*
                    this.app.loading = false;
                    dialog.confirm({
                        title: 'Could Not Update Order',
                        message: 'Ensure your have a strong network signal and try again.',
                        okButtonText: 'OK'
                    });
                    */
                }
            });
        }
    }

    private editCustomer (e) {
        console.log('orderdetail editCustomer',e.index);
        console.log(this.customerData[e.index]);
        console.log(this.ttCustomer[this.customerData[e.index].columnLabel]);
        this.customerDataList.scrollToIndexAnimated(e.index);
    }

    private updateCustomer (index,newValue) {
        console.log('orderdetail updateCustomer',index,newValue);
        console.log(this.customerData[index]);
        console.log(this.ttCustomer[this.customerData[index].columnLabel]);
        if (this.ttCustomer[this.customerData[index].columnLabel] !== newValue) {
            this.ttCustomer[this.customerData[index].columnLabel] = newValue;
            this.net.updateCustomer({
                ttCustomer: this.ttCustomer,
                onSuccess: () => {console.log('orderdetail updateCustomer SUCCESS')},
                onError: () => {
                    console.log('orderdetail updateCustomer ERROR');
                    /*
                    this.app.loading = false;
                    dialog.confirm({
                        title: 'Could Not Update Order',
                        message: 'Ensure your have a strong network signal and try again.',
                        okButtonText: 'OK'
                    });
                    */
                }
            });
        }
    }

    private addLine () {
        console.log('orderdetail addLine');
        this.app.animateIcon({
            target: this.rightIcon,
            onSuccess: () => {
                console.log('will add line -- TBD');
            }
        });
    }

    private confirmRemoveOrder () {
        console.log('orderdetail confirmRemoveOrder');
        dialog.confirm('Are you sure you want to remove this order and all of its order lines?')
        .then((reply)=>{
            if (reply) this.removeOrder();
        })
    }
    private removeOrder () {
        console.log('orderdetail removeOrder');
        this.net.removeOrder({
            Ordernum: this.Ordernum,
            onSuccess: () => this.showOrders(),
            onError: () => {
                this.app.loading = false;
                dialog.confirm({
                    title: 'Could Not Remove Order',
                    message: 'Ensure your have a strong network signal and try again.',
                    okButtonText: 'OK'
                });
            }
        });
    }

    private selectTab (tabNumber) {
        console.log('orderdetail selectTab',tabNumber);
        if (tabNumber === 1) this.orderDataList.scrollToIndexAnimated(0);
        if (tabNumber === 2) this.customerDataList.scrollToIndexAnimated(0);
        this.selectedTab = tabNumber;
    }
}