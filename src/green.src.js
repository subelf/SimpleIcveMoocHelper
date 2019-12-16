// ==UserScript==
// @name         智慧职教网课助手 绿版
// @version      2.07
// @description  智慧职教简易自动刷课脚本
// @author        tuChanged
// @run-at       document-end
// @grant        unsafeWindow
// @match       *://zjy2.icve.com.cn/common/*
// ==/UserScript==
(function () {
    'use strict';
    const setting = {
        // 随机评论
        randomComment: ["666666"],
        //最高延时
        maxDelayTime: 7000,
        //最低延时
        minDelayTime: 4000,
        //ppt下一页点击次数
        pptNextClick: 20,
        //0-高清 1-清晰 2-流畅 3-原画
        videoQuality: 2,
        //2倍速
        videoPlaybackRate: 2
    }, _self = unsafeWindow,
        url = location.pathname,
        top = _self
    //获取jquery
    try {
        while (top != _self.top) top = top.parent.document ? top.parent : _self.top;
    } catch (err) {
        console.log(err);
        top = _self;
    }
    var $ = _self.jQuery || top.jQuery;

    //产生区间随机
    const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

    /**
     * 使用异步实现
     * 
     *  随机延迟执行方法
     * @param {需委托执行的函数} func 
     */

    function delayExec(func) {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                await func()
                resolve();
            }, rnd(setting.minDelayTime, setting.maxDelayTime));
        })
    }
    //手动加锁 防止递归失败请求数太多导致封禁
    let j = 0;
    //跳转到某小节 通过顶栏 
    const gotoUrl = (page) => {
        if (j >= 1) {
            alert('异步处理异常')
            while (true) console.log("我死了");
        }
        j++
        page.click()
        j = 0
    }
    //打开菜单
    const openMenu = () => {
        //关闭窗口
        if ($('.popBox').length !== 0) {
            $($('.popBox a')[1]).click()
        }
        $(".sildeDirectory").click();
    }
    //跳转下一页
    // var nextCourse = () => $(".next").click();
    const lessonID = getQueryValue("cellId")
    delayExec(async () => {
        //变量提升全局变量

        console.log(`当前课程ID: ${lessonID}`);

        //入口
        switch (url) {
            case "/common/directory/directory.html":
                openMenu()
                await delayExec(async () => {
                    await expandDir();
                    openMenu()
                    console.log("目录已全展开");
                })
                locateCurrentLocation()
                _main();
                break;
            default:
                console.log(`脚本已准备启动 当前位置:${url}`);
                break;
        }
    })

    //当前页
    let current;

    //处理当前选中项
    async function _main() {

        //打开课程列表
        openMenu()
        //main函数
        setTimeout(async () => {

            //当前小节
            current = $(".np-section-level-3.active");

            //跳到第一页
            if (current.length == 0) {
                console.log(current);
                current = $($(".np-section-level-3")[0])
            }
            //当前已完成直接开始下一轮
            if (isFinshed(current)) {
                check(current.next());
                return
            }


            //当前小节课程的类别
            let type = current.children(".np-section-type").text().trim()

            switch (type) {
                case "图片":
                case "文档":
                    docHandler(current)
                    break;
                case "ppt":
                    pptHandler(current)
                    break;
                case "swf":
                    swfHandler(current)
                    break;
                case "视频":
                    videoHandler(current);
                    break;
            }
            console.log(`当前 ${type} 安排完成,等待执行结果中`);
        }, 5000);
    }


    /**
     * 获取url查询字段
     * @param {查询字段} query 
     */
    function getQueryValue(query) {
        let url = window.location.search; //获取url中"?"符后的字串
        let theRequest = new Object();
        if (url.indexOf("?") != -1) {
            let str = url.substr(1);
            let strs = str.split("&");
            for (let i = 0; i < strs.length; i++)
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
        return theRequest[query];
    }
    /**
     * 找到从课程列表进来点击的位置
     * @param {*} id 
     */
    function locateCurrentLocation() {
        $('.np-section-level-3.cellClick').each((i, e) => {
            let x = $(e)
            if (x.data().cellid === lessonID) {
                x.click()
                return
            }
        })
        console.log(`未找到 课程${lessonID}`);

    }


    /**
     * 异步展开全目录
     */
    function expandDir() {
        return new Promise((resolve, reject) => {
            let root = $(".np-section-level-1 .np-section-title");

            root.each(async (i1, e1) => {
                $(e1).click()
                await delayExec(async () => {
                    $(e1).next("ol").find(".np-section-level-2 a").each(async (i2, e2) => {
                        await delayExec(async () => {
                            $(e2).click()
                            //执行完成
                            if (i1 === 0) {
                                resolve()
                            }
                        })
                    })
                })
            })
        })
    }

    /**
     * 递归遍历目录树
     */
    async function check(currentInner) {

        // todo 递归有问题
        //多级跳转
        if (currentInner.length == 0) {
            // current.end();
            //往树根遍历
            //小章节
            let parent = current.closest(".np-section-level-2");
            if (parent.next().length == 0) {
                //大章
                let ancestor = parent.closest(".np-section-level-1")
                //检测是否到终章
                if (ancestor.next().length == 0) {
                    alert("任务完成");
                    //关闭当前窗口
                    // closeTab();
                } else {
                    // first 进来后 next后导致空出一个
                    check(ancestor.next().find(".np-section-level-3").first());
                }
            } else {
                check(parent.next().find(".np-section-level-3").first())
            }
            return;
        }
        //查询下一项所属类别
        switch (currentInner.children(".np-section-type").text().trim()) {
            case "swf":
            case "ppt":
            case "视频":
            case "文档":
            case "图片":
                await delayExec(() => {
                    gotoUrl(currentInner)
                })
                _main()
                break;
        }
    }
    /**
     * 作业处理
     */
    function homeworkHandler() {
        uncageCopyLimit()
    }
    /*
     *  解除文本限制   
     */
    function uncageCopyLimit() {
        let arr = ["oncontextmenu", "ondragstart", "onselectstart", "onselect", "oncopy", "onbeforecopy"]
        for (let i of arr)
            $(".hasNoLeft").attr(i, "return true")
        console.log("已成功解除限制")
    }


    async function swfHandler(current) {
        //当不支持flash时执行   
        if ($('.popBox').length !== 0) {
            $($('.popBox a')[1]).click()
        }
        await delayExec(commentHandler(current))
    }

    /**
     * 视频类处理
     */
    function videoHandler(current) {
        let player = top.jwplayer($(".jwplayer").attr("id"));
        //播放回调
        if (player.getState() == "complete") {
            console.log("视频原已播放完毕\n");
            delayExec(commentHandler(current));
            return;
        }
        //配置
        player.setMute(true)//静音
        player.setCurrentQuality(setting.videoQuality);
        //播放回调
        player.on("playlistComplete", () => {
            console.log("视频播放完成\n");
            delayExec(commentHandler(current));
        });
    }
    /**
     * 文档处理
     * @param {*} current 
     */
    async function docHandler(current) {
        //随机秒后执行,避免不正常操作加载时间

        //根据按钮状态判断是否还有下一页
        while ($(".MPreview-pageNext").hasClass('current')) {
            console.log("翻页了");

            //ppt翻页 异步方式
            await delayExec(() => {
                $(".MPreview-pageNext").click()
            })
        }

        //提交评论?
        //随机延迟提交评论
        delayExec(commentHandler(current));
    }


    /**
     * PPT类别处理
     * 指定PPT点击次数(无法获取iframe无法判定是否完成)
     *  TODO 无法跨域获取iframe,暂未解决
     */
    async function pptHandler(current) {
        // 异步处理
        await new Promise(async (resolve, reject) => {
            for (let i = 1; i <= setting.pptNextClick; i++) {
                //点击下一页
                await delayExec(() => {
                    $(".stage-next").click()
                    //达到次数解除阻塞
                    if (i == setting.pptNextClick)
                        resolve()
                })
            }
        })

        //提交评论?
        //随机延迟提交评论
        delayExec(commentHandler(current));
    }


    /**
    * 处理评论
    *    并准备换页
    */
    async function commentHandler(current) {

        if (isFinshed(current)) {
            check(current.next());
            return
        }
        //评5星
        $("#star #starImg4").click();
        //随机从词库填写评论
        $(".commentContent").text(setting.randomComment[rnd(0, setting.randomComment.length - 1)])
        //提交
        await delayExec(async () => {
            $("#btnComment").click();
            await delayExec(async () => {
                $(".sgBtn.ok").click();
                console.log("评论成功\n");
                check(current.next());
            });
        });
    }
    /**
     * 判断当前页是否已经完成
     * @param {*} current 
     */
    function isFinshed(current) {
        //防止对话框遮盖
        if ($('.popBox').length !== 0) {
            $($('.popBox a')[1]).click()
        }
        //在当前评论页已发现自己的评论,取消评论
        if ($(".np-question-remove.commentDel").length !== 0) {
            console.log("已评论过了");
            return true
        }
        return false
    }
    /**
    * 提交讨论
    */
    function discussHandler() {
        setTimeout(() => {
            //获取上一位的评论  隔两个索引为评论  字数太少往下查找,避免太水
            let vaildComment = findVaildDiscuss();
            // //开启HTML输入模式
            // $EDITORUI["edui945"]._onClick();
            //填充评论
            $("iframe#ueditor_0").contents().find("body.view")[0].innerText = vaildComment;
            //提交
            delayExec(() => {
                $(".btn_replyTopic").click();
                console.log("讨论成功\n");
            }
            );
        }, 10000);
        /*  //返回上一页
         delayExec(() => window.history.go(-1)); */
    }

    /**
     * 简单地找出一个有效的讨论
     */
    function findVaildDiscuss() {
        let arr = $(".mc-learning-table  tbody tr div[id^='istext_']"), element;
        for (let i = 0; i < arr.length; i++) {
            element = arr[i].innerText;
            if (element.length > 10)
                return element;
        }
        return element;
    }
    /**
    * 提取当前页内容
    */
    function exactProblem() {
        const arr = $(".e-q-body");
        let text = "";

        for (let x = 0; x < arr.length; x++)
            text += arr[x].innerText;
        $("#_content").val(text);

    }
    /**
     * 提取题目
     */
    function floatHandler() {
        const div = `<div style="border:#42b983 solid 2px;width: 330px; position: fixed; top: 0; right: 10px;  z-index: 99999">
                        <button id="extract_btn">提取</button>
                        <hr/>
                        <textarea id="_content" style="width: 100%;height: 300px;border: #B3C0D1 solid 2px;overflow: auto;font-size: x-small" />
                    </div>`;
        $(div).appendTo('body')
        $("#extract_btn").bind('click', () => exactProblem())
    }
})();
