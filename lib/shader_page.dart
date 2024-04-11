import 'dart:async';
import 'dart:ui';

import 'package:flutter/material.dart';

class GeneralShaderPage extends StatefulWidget {
  const GeneralShaderPage(
      {super.key, required this.shaderPath, this.index = 0});
  final int index;
  final String shaderPath;

  @override
  State<GeneralShaderPage> createState() => _GeneralShaderPageState();
}

class _GeneralShaderPageState extends State<GeneralShaderPage> {
  late Timer timer;
  double delta = 0;
  FragmentShader? shader;

  @override
  void initState() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadShader();
    });
    super.initState();
  }

  @override
  void dispose() {
    timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.sizeOf(context);

    return Scaffold(
      extendBodyBehindAppBar: true,
      extendBody: true,
      body: SizedBox(
        width: size.width,
        height: size.height,
        child: _body(),
      ),
    );
  }

  Widget _body() {
    if (shader == null) {
      return const Center(child: CircularProgressIndicator());
    } else {
      return CustomPaint(
        painter: GeneralPainter(shader!, delta + (widget.index + 10)),
      );
    }
  }

  void _loadShader() async {
    var program = await FragmentProgram.fromAsset(widget.shaderPath);
    shader = program.fragmentShader();
    setState(() {
      // trigger a repaint
    });

    timer = Timer.periodic(const Duration(milliseconds: 16), (timer) {
      setState(() {
        delta += 1 / 60;
      });
    });
  }
}

class GeneralPainter extends CustomPainter {
  final FragmentShader shader;
  final double time;

  GeneralPainter(FragmentShader fragmentShader, this.time)
      : shader = fragmentShader;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint();
    shader.setFloat(0, time);
    shader.setFloat(1, size.height);
    shader.setFloat(2, size.width);
    // shader.setFloat(2, size.height);
    paint.shader = shader;
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return oldDelegate != this;
  }
}
