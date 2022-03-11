import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { ListboxModule } from 'primeng/listbox';
import { OrderListModule } from 'primeng/orderlist';
import { MenuModule } from 'primeng/menu';

import { delay } from 'rxjs/operators';
import { DotBlockEditorComponent } from './dot-block-editor.component';
import { BubbleMenuLinkFormComponent } from '@dotcms/block-editor';
import {
    ActionButtonComponent,
    ContentletBlockComponent,
    NgxTiptapModule,
    SuggestionsComponent,
    SuggestionsService,
    ImageBlockComponent,
    DragHandlerComponent,
    LoaderComponent,
    DotImageService,
    DotLanguageService
} from '@dotcms/block-editor';

export default {
    title: 'Block Editor'
};

export const primary = () => ({
    moduleMetadata: {
        imports: [
            MenuModule,
            CommonModule,
            FormsModule,
            NgxTiptapModule,
            OrderListModule,
            ListboxModule,
            BrowserAnimationsModule
        ],
        providers: [
            {
                provide: DotImageService,
                useValue: {
                    publishContent() {
                        return of([
                            {
                                cd769844de530f7b5d3434b1b5cfdd62: {
                                    asset: 'https://media.istockphoto.com/vectors/costa-rica-vector-id652225694?s=170667a',
                                    mimeType: 'image/png',
                                    name: 'costarica.png'
                                }
                            }
                        ]).pipe(delay(800));
                    }
                }
            },
            {
                provide: SuggestionsService,
                useValue: {
                    getContentTypes() {
                        return of([
                            {
                                name: 'Empty Content',
                                icon: 'hourglass_disabled',
                                variable: 'empty'
                            },
                            {
                                name: 'Blog',
                                icon: 'article',
                                variable: 'blog'
                            },
                            {
                                name: 'Persona',
                                icon: 'face',
                                variable: 'persona'
                            },
                            {
                                name: 'News Item',
                                icon: 'mic',
                                variable: 'news_item'
                            },
                            {
                                name: 'Banner',
                                icon: 'view_carousel',
                                variable: 'banner'
                            },
                            {
                                name: 'Product in the store',
                                icon: 'inventory_2',
                                variable: 'inventory'
                            },
                            {
                                name: 'Reatil information',
                                icon: 'storefront',
                                variable: 'retail'
                            }
                        ]);
                    },
                    getContentlets(type) {
                        if (type === 'empty') {
                            return of([]).pipe(delay(800));
                        }

                        return of([
                            {
                                hostName: 'demo.dotcms.com',
                                modDate: '2021-10-20 14:56:53.052',
                                publishDate: '2021-10-20 14:56:53.052',
                                postingDate: '2019-07-16 20:06:00.0',
                                title: 'Easy Snowboard Tricks You can Start Using Right Away',
                                body: '<p>Before you start learning tricks, even easy snowboard tricks, you should have mastered some of the basics. You especially need to be confident riding both ways (riding switch) down the mountain before getting into any tricks.</p>\n<h2>Before you Start</h2>\n<p>In a lot of snowboarding tricks, even easy ones you are going to be either setting up in or landing in your switch position.</p>\n<p>The best time to learn tricks is when you&rsquo;ve had a good recent dump of snow &ndash; so that the landing is going to be fairly soft. This isn&rsquo;t always possible so if this isn&rsquo;t the case then you just need to be prepared to take a few hard knocks.</p>\n<p>Remember that there is always a risk of injury in snowboarding and this is especially so when you are learning new things like tricks. You need to push yourself a little bit to expand your skillset but don&rsquo;t push yourself to try unrealistic things.</p>\n<p>Pushing to hard can potentially lead to injury, bad technique and a loss of confidence amongst other things.</p>\n<p>Not stepping outside your comfort zone at all, on the other hand, will stop you from being able to progress.<br />The Tricks in this Post</p>\n<p>All the tricks in this post are for those who are new at tricks. I find the best way to learn is to learn and master one trick before moving on to the next. I would also learn these in order.</p>\n<p>Each of the following will be a good foundation for learning bigger better tricks later down the line:</p>\n<ul>\n<li>Ollies</li>\n<li>Manuals</li>\n<li>Butters</li>\n<li>Ground 180s</li>\n</ul>\n<h2>Ollies</h2>\n<p>Ollies are going to be the foundation of a lot of aerial tricks. For now you are going to be performing ollies off the ground but later you will use the same techniques to get extra air off jumps, jumping small obstacles and the likes.</p>\n<p>Ollies will also help you get used to being airborne but in a way that&rsquo;s not too high so you can build your confidence slowly.</p>\n<p>It will also help you to practice landing. Try to get the landing technique right from the outset. You may get away with poor landing technique on ollies but if you learn bad habits, it will make it much more difficult and much less successful when you are trying to land bigger jumps and tricks down the line.</p>\n<p>Be sure to start out on a gentle slope when first learning ollies and try to make sure there isn&rsquo;t too much traffic around &ndash; traffic will make it harder for you and more likely that you&rsquo;ll take others out when you wipe out!</p>\n<p>Check out the link below for a step by step tutorial of how to perform an Ollie.</p>\n<h2>Manuals</h2>\n<p>Manuals are also known as wheelies or presses. You can do tail manuals or nose manuals (a.k.a. tail presses and nose presses).</p>\n<p>These are pretty easy to perform and form the foundation for more complex tricks like butters (see below). The idea behind a manual is simply that you balance on either the tail or the nose of the board as you ride.</p>\n<p>You can simply ride into a manual, jump into a manual or land a trick onto a manual. But let&rsquo;s stick with the basics first! Check out the link below for the process.</p>\n<h2>Butters</h2>\n<p>A little bit of a step up from a manual is a butter.</p>\n<p>This is essentially a spin that is done whilst just balancing on either the tail or nose of the snowboard. There are many variations you can use and you can incorporate butters into other tricks.</p>\n<p>It&rsquo;s important that you learn manuals (presses) before you learn butters. Once you have your manual down check out the link to learn butters.</p>\n<h2>Frontside 180s</h2>\n<p>It&rsquo;s essential that you&rsquo;ve learned to ollie and are really comfortable with ollies before you perform ground 180s. You need to be able to get some decent air off the ground and be comfortable landing.</p>\n<p>This will teach you to perform 180s from going from both your normal stance (be it regular or goofy) and landing in switch and from your switch stance and landing in your normal stance. In both directions you should start by performing frontside 180s.</p>\n<p>Once you are comfortable with frontside 180s you can get into backside 180s and more.</p>\n<p>There are a lot of different 180s you can perform and once you are comfortable on the ground you can start doing them off jumps, jibs, with grabs etc. And of course 180s are also the foundation for learning 360s, 540s etc.</p>',
                                baseType: 'CONTENT',
                                inode: 'af12671a-1cff-44da-92cc-ce4fae2e4a70',
                                archived: false,
                                host: '48190c8c-42c4-46af-8d1a-0cd5db894797',
                                working: true,
                                locked: false,
                                stInode: '799f176a-d32e-4844-a07c-1b5fcd107578',
                                contentType: 'Blog',
                                live: true,
                                owner: 'dotcms.org.1',
                                imageVersion:
                                    '/dA/af12671a-1cff-44da-92cc-ce4fae2e4a70/image/adventure-alpine-climb-240160.jpg',
                                identifier: 'f1d378c9-b784-45d0-a43c-9790af678f13',
                                image: '/dA/f1d378c9-b784-45d0-a43c-9790af678f13/image/adventure-alpine-climb-240160.jpg',
                                imageContentAsset: 'f1d378c9-b784-45d0-a43c-9790af678f13/image',
                                urlTitle: 'easy-snowboard-tricks-you-can-start-using-right-away',
                                languageId: 1,
                                URL_MAP_FOR_CONTENT:
                                    '/blog/post/easy-snowboard-tricks-you-can-start-using-right-away',
                                url: '/content.0bfe0df9-d9c8-4fae-bf4d-6b1c1e096013',
                                tags: 'tips and tricks,snowboarding',
                                titleImage: 'image',
                                modUserName: 'Admin User',
                                urlMap: '/blog/post/easy-snowboard-tricks-you-can-start-using-right-away',
                                hasLiveVersion: true,
                                folder: 'SYSTEM_FOLDER',
                                hasTitleImage: true,
                                sortOrder: 0,
                                modUser: 'dotcms.org.1',
                                teaser: 'Introduction to some easy snowboarding tricks you can started using today. Before you start learning tricks, even easy snowboard tricks, you should have mastered some of the basics.',
                                __icon__: 'contentIcon',
                                contentTypeIcon: 'file_copy'
                            },
                            {
                                title: 'Aliquam tincidunt mauris eu risus.',
                                inode: '456',
                                image: 'https://images.unsplash.com/photo-1433883669848-fa8a7ce070b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2988&q=80',
                                languageId: 1
                            },
                            {
                                title: 'Vestibulum auctor dapibus neque.',
                                inode: '789',
                                image: 'https://images.unsplash.com/photo-1433883669848-fa8a7ce070b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2988&q=80',
                                languageId: 1
                            },
                            {
                                title: 'Nunc dignissim risus id metus.',
                                inode: '1011',
                                image: 'https://images.unsplash.com/photo-1433883669848-fa8a7ce070b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2988&q=80',
                                languageId: 1
                            },
                            {
                                title: 'Cras ornare tristique elit.',
                                inode: '1213',
                                image: 'https://images.unsplash.com/photo-1433883669848-fa8a7ce070b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2988&q=80',
                                languageId: 1
                            },
                            {
                                title: 'Vivamus vestibulum ntulla nec ante.',
                                inode: '1415',
                                image: 'https://images.unsplash.com/photo-1433883669848-fa8a7ce070b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2988&q=80',
                                languageId: 1
                            },
                            {
                                title: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
                                inode: '123',
                                image: 'https://images.unsplash.com/photo-1433883669848-fa8a7ce070b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2988&q=80',
                                languageId: 1
                            },
                            {
                                title: 'Aliquam tincidunt mauris eu risus.',
                                inode: '456',
                                image: 'https://images.unsplash.com/photo-1433883669848-fa8a7ce070b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2988&q=80',
                                languageId: 1
                            },
                            {
                                title: 'Vestibulum auctor dapibus neque.',
                                inode: '789',
                                image: 'https://images.unsplash.com/photo-1433883669848-fa8a7ce070b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2988&q=80',
                                languageId: 2
                            },
                            {
                                title: 'Nunc dignissim risus id metus.',
                                inode: '1011',
                                image: 'https://images.unsplash.com/photo-1433883669848-fa8a7ce070b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2988&q=80',
                                languageId: 2
                            },
                            {
                                title: 'Cras ornare tristique elit.',
                                inode: '1213',
                                image: 'https://images.unsplash.com/photo-1433883669848-fa8a7ce070b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2988&q=80',
                                languageId: 2
                            },
                            {
                                title: 'Vivamus vestibulum ntulla nec ante.',
                                inode: '1415',
                                image: 'https://images.unsplash.com/photo-1433883669848-fa8a7ce070b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2988&q=80',
                                languageId: 2
                            },
                            {
                                title: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
                                inode: '123',
                                image: 'https://images.unsplash.com/photo-1433883669848-fa8a7ce070b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2988&q=80',
                                languageId: 2
                            },
                            {
                                title: 'Aliquam tincidunt mauris eu risus.',
                                inode: '456',
                                image: 'https://images.unsplash.com/photo-1433883669848-fa8a7ce070b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2988&q=80',
                                languageId: 2
                            },
                            {
                                title: 'Vestibulum auctor dapibus neque.',
                                inode: '789',
                                image: 'https://images.unsplash.com/photo-1433883669848-fa8a7ce070b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2988&q=80',
                                languageId: 2
                            },
                            {
                                title: 'Nunc dignissim risus id metus.',
                                inode: '1011',
                                image: 'https://images.unsplash.com/photo-1433883669848-fa8a7ce070b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2988&q=80',
                                languageId: 2
                            },
                            {
                                title: 'Cras ornare tristique elit.',
                                inode: '1213',
                                image: 'https://images.unsplash.com/photo-1433883669848-fa8a7ce070b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2988&q=80',
                                languageId: 2
                            },
                            {
                                title: 'Vivamus vestibulum ntulla nec ante.',
                                inode: '1415',
                                image: 'https://images.unsplash.com/photo-1433883669848-fa8a7ce070b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2988&q=80',
                                languageId: 2
                            },
                            {
                                title: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
                                inode: '123',
                                image: 'https://images.unsplash.com/photo-1433883669848-fa8a7ce070b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2988&q=80',
                                languageId: 2
                            },
                            {
                                title: 'Aliquam tincidunt mauris eu risus.',
                                inode: '456',
                                image: 'https://images.unsplash.com/photo-1433883669848-fa8a7ce070b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2988&q=80',
                                languageId: 2
                            },
                            {
                                title: 'Vestibulum auctor dapibus neque.',
                                inode: '789',
                                image: 'https://images.unsplash.com/photo-1433883669848-fa8a7ce070b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2988&q=80',
                                languageId: 2
                            },
                            {
                                title: 'Nunc dignissim risus id metus.',
                                inode: '1011',
                                image: 'https://images.unsplash.com/photo-1433883669848-fa8a7ce070b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2988&q=80',
                                languageId: 2
                            },
                            {
                                title: 'Cras ornare tristique elit.',
                                inode: '1213',
                                image: 'https://images.unsplash.com/photo-1433883669848-fa8a7ce070b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2988&q=80',
                                languageId: 2
                            },
                            {
                                title: 'Vivamus vestibulum ntulla nec ante.',
                                inode: '1415',
                                image: 'https://images.unsplash.com/photo-1433883669848-fa8a7ce070b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2988&q=80',
                                languageId: 2
                            }
                        ]).pipe(delay(800));
                    }
                }
            },
            {
                provide: DotLanguageService,
                useValue: {
                    getLanguages() {
                        return of({
                            1: {
                                country: 'United States',
                                countryCode: 'US',
                                defaultLanguage: true,
                                id: 1,
                                language: 'English',
                                languageCode: 'en'
                            },
                            2: {
                                country: 'Espana',
                                countryCode: 'ES',
                                defaultLanguage: false,
                                id: 2,
                                language: 'Espanol',
                                languageCode: 'es'
                            }
                        });
                    }
                }
            }
        ],
        // We need these here because they are dynamically rendered
        entryComponents: [
            SuggestionsComponent,
            ContentletBlockComponent,
            ActionButtonComponent,
            DragHandlerComponent,
            ImageBlockComponent,
            LoaderComponent,
            BubbleMenuLinkFormComponent
        ]
    },
    component: DotBlockEditorComponent
});
